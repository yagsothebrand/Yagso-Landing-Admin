import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShoppingBag,
  CreditCard,
  Lock,
  Mail,
  Phone,
  ArrowLeft,
  Package,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useProducts } from "@/components/auth/ProductsProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCheckout } from "@/components/auth/CheckoutProvider";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const BRAND = "#948179";
const cx = (...c) => c.filter(Boolean).join(" ");

export default function CheckoutPage() {
  const navigate = useNavigate();

  const { cart, getCartTotal, formatPrice, guestUserId, checkout } =
    useProducts();

  const [message, setMessage] = useState("");
  const [shouldSaveBilling, setShouldSaveBilling] = useState(false);

  const { user, login, register, saveBillingInfo } = useAuth();
  const {
    loading,
    setLoading,
    checkoutId,
    email,
    setEmail,
    phone,
    setPhone,
    createAccount,
    setCreateAccount,
    password,
    setPassword,
    isReturning,
    setIsReturning,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    billingInfo,
    setBillingInfo,
    useSavedBilling,
    setUseSavedBilling,
    savedBillingOptions,
    saveCheckoutToFirebase,
  } = useCheckout();

  const pageBg = "min-h-screen bg-[#fbfaf8]";
  const shell = "max-w-6xl mx-auto px-4";

  const card =
    "bg-white/80 backdrop-blur border border-slate-200 rounded-none overflow-hidden";
  const cardHeader = "px-6 py-4 border-b border-slate-200 bg-white/70";
  const cardTitle =
    "text-sm tracking-[0.18em] uppercase font-bold text-slate-700";

  const input =
    "h-11 rounded-none border-slate-200 bg-white placeholder:text-slate-300 focus-visible:ring-0 focus-visible:border-slate-400";
  const iconInput =
    "pl-10 h-11 rounded-none border-slate-200 bg-white placeholder:text-slate-300 focus-visible:ring-0 focus-visible:border-slate-400";

  const NIGERIAN_STATES = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];
  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.phone) setPhone(user.phone);

    if (user) {
      setCreateAccount(false);
      setPassword("");
    }
  }, [user]);
  if (cart.length === 0) {
    return (
      <div className={cx(pageBg, "pt-24")}>
        <div className={cx(shell, "flex items-center justify-center")}>
          <div className="text-center">
            <ShoppingBag
              className="w-14 h-14 mx-auto mb-4"
              style={{ color: BRAND }}
            />
            <p className="text-sm tracking-[0.18em] uppercase text-slate-500">
              Checkout
            </p>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">
              Add items to your cart to continue.
            </p>
            <Button
              onClick={() => navigate("/shop")}
              className="h-11 rounded-none text-white font-semibold tracking-wide hover:opacity-90"
              style={{ backgroundColor: BRAND }}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleReturningLogin = async () => {
    try {
      setLoading(true);
      await login(loginEmail, loginPassword);

      setCreateAccount(false);
      setPassword("");
      setIsReturning(false);
    } catch (error) {
      setMessage("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSavedBilling = (saved) => {
    setBillingInfo(saved);
    setUseSavedBilling(true);
  };

  const handlePayWithPaystack = async () => {
    if (!window.PaystackPop) {
      setMessage("Paystack not loaded. Refresh page.");
      return;
    }

    if (!email || !phone) {
      setMessage("Please fill in all contact information");
      return;
    }

    if (!billingInfo.fullName || !billingInfo.address || !billingInfo.city) {
      setMessage("Please fill in all billing information");
      return;
    }

    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      let effectiveUser = user;

      // ✅ If creating account, create and immediately use returned UID (no waiting)
      if (createAccount) {
        if (!password) {
          setMessage("Password is required to create an account");
          setLoading(false);
          return;
        }

        effectiveUser = await register(email, password, { phone });

        setCreateAccount(false);
        setPassword("");
        setIsReturning(false);
      }

      const effectiveUserId = effectiveUser?.uid || null;

      // ✅ Save billing (uses override uid so no "User not logged in")
      if (effectiveUserId && shouldSaveBilling && !useSavedBilling) {
        await saveBillingInfo(billingInfo, effectiveUserId);
      }

      // ✅ Save checkout ONCE (works for guest + logged in + just created)
      await saveCheckoutToFirebase({
        userId: effectiveUserId,
        guestUserId,
      });

      const reference = "JP_" + Date.now();

      const handler = window.PaystackPop.setup({
        key: "pk_test_8a6bb69995275fd42c913994e3745cbe7f88b268",
        email,
        amount: Math.round(getCartTotal() * 100),
        currency: "NGN",
        ref: reference,

        metadata: {
          checkoutId: checkoutId || null,
          guestUserId: guestUserId || null,
          userId: effectiveUserId,
          phone,
        },

        callback: function (response) {
          (async function () {
            try {
              const orderData = {
                checkoutId: checkoutId || null,
                cart,
                total: getCartTotal(),
                email,
                phone,
                billingInfo,
                userId: effectiveUserId,
                guestUserId: guestUserId || null,
                payment: {
                  provider: "paystack",
                  reference: response.reference,
                  status: "success",
                  channel: "inline-v1",
                },
                status: "paid",
                createdAt: serverTimestamp(),
              };

              const orderRef = await addDoc(
                collection(db, "orders"),
                orderData,
              );
              await checkout({
                orderId: orderRef.id,
                paymentRef: response.reference,
              });

              if (checkoutId) {
                await updateDoc(doc(db, "checkouts", checkoutId), {
                  status: "completed",
                  orderId: orderRef.id,
                  paymentRef: response.reference,
                  completedAt: serverTimestamp(),
                });
              }

              // clearCart();
              navigate(`/order-success?orderId=${orderRef.id}`);
            } catch (err) {
              console.error(err);
              setMessage("Payment succeeded but order creation failed");
            } finally {
              setLoading(false);
            }
          })();
        },

        onClose: function () {
          setLoading(false);
          setMessage("Payment cancelled");
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className={cx(pageBg, "pb-20")}>
      {/* Sticky top strip like ProductDetails */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div
          className={cx(shell, "py-3 flex items-center justify-between gap-3")}
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" style={{ color: BRAND }} />
            Back
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4" style={{ color: BRAND }} />
            Secure Payment
          </div>
        </div>
      </div>

      <div className={cx(shell, "py-6")}>
        <div className="mb-5">
          <p
            className="text-[12px] tracking-[0.18em] uppercase"
            style={{ color: BRAND }}
          >
            Secure Checkout
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            Checkout
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {!!message && (
            <motion.div
              key="msg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 rounded-none"
              role="alert"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left */}
          <div className="lg:col-span-3 space-y-5">
            {/* Contact */}
            <div className={card}>
              <div className={cardHeader}>
                <div className="flex items-center justify-between">
                  <p className={cardTitle}>Contact</p>
                  <span className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                    Step 1
                  </span>
                </div>
              </div>

              <div className="p-6">
                {!user && (
                  <div
                    className="border bg-white p-4 rounded-none mb-5"
                    style={{ borderColor: `${BRAND}26` }}
                  >
                    <button
                      onClick={() => {
                        setIsReturning(!isReturning);
                        setCreateAccount(false);
                        setPassword("");
                      }}
                      className="text-sm font-semibold hover:opacity-80 transition"
                      style={{ color: BRAND }}
                    >
                      {isReturning
                        ? "← Continue as guest"
                        : "Already have an account? Sign in →"}
                    </button>
                  </div>
                )}

                {isReturning && !user && (
                  <div
                    className="border bg-white p-5 rounded-none mb-5"
                    style={{ borderColor: `${BRAND}33` }}
                  >
                    <div className="space-y-3">
                      <div>
                        <Label className="text-slate-700 text-xs tracking-wide uppercase">
                          Email
                        </Label>
                        <Input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="your@email.com"
                          className={cx("mt-1.5", input)}
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-xs tracking-wide uppercase">
                          Password
                        </Label>
                        <Input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className={cx("mt-1.5", input)}
                        />
                      </div>

                      <Button
                        onClick={handleReturningLogin}
                        disabled={loading}
                        className="w-full h-11 rounded-none text-white font-semibold tracking-wide hover:opacity-90"
                        style={{ backgroundColor: BRAND }}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-slate-700 text-xs tracking-wide uppercase"
                    >
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className={iconInput}
                        disabled={!!user?.email}
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-slate-700 text-xs tracking-wide uppercase"
                    >
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className={iconInput}
                      />
                    </div>
                  </div>
                </div>

                {!user && (
                  <div
                    className="mt-5 border bg-white p-4 rounded-none"
                    style={{ borderColor: `${BRAND}26` }}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="createAccount"
                        checked={createAccount}
                        onCheckedChange={setCreateAccount}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="createAccount"
                          className="font-semibold cursor-pointer text-slate-900"
                        >
                          Create an account
                        </Label>
                        <p className="text-xs text-slate-500 mt-1">
                          Save your info and track orders.
                        </p>
                      </div>
                    </div>

                    {createAccount && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mt-4"
                      >
                        <Label
                          htmlFor="password"
                          className="text-slate-700 text-xs tracking-wide uppercase"
                        >
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative mt-1.5">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            className={iconInput}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Billing */}
            <div className={card}>
              <div className={cardHeader}>
                <div className="flex items-center justify-between">
                  <p className={cardTitle}>Billing</p>
                  <span className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                    Step 2
                  </span>
                </div>
              </div>

              <div className="p-6">
                {user && savedBillingOptions.length > 0 && (
                  <div className="mb-5 space-y-3">
                    <Label className="text-xs tracking-wide uppercase text-slate-600 font-bold">
                      Saved Addresses
                    </Label>

                    {savedBillingOptions.map((saved, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSavedBilling(saved)}
                        className={cx(
                          "p-4 border rounded-none cursor-pointer transition bg-white",
                          useSavedBilling &&
                            billingInfo.address === saved.address
                            ? "shadow-sm"
                            : "hover:border-slate-300",
                        )}
                        style={{
                          borderColor:
                            useSavedBilling &&
                            billingInfo.address === saved.address
                              ? `${BRAND}66`
                              : "#e2e8f0",
                        }}
                      >
                        <p className="font-semibold text-slate-900">
                          {saved.fullName}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          {saved.address}, {saved.city}
                          {saved.state && `, ${saved.state}`}
                        </p>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        setUseSavedBilling(false);
                        setBillingInfo({
                          fullName: "",
                          address: "",
                          city: "",
                          state: "",
                          zipCode: "",
                          country: "Nigeria",
                        });
                      }}
                      className="text-sm font-semibold hover:opacity-80"
                      style={{ color: BRAND }}
                    >
                      + Use a different address
                    </button>
                  </div>
                )}

                {(!useSavedBilling || savedBillingOptions.length === 0) && (
                  <>
                    {(user || createAccount) && (
                      <div
                        className="border bg-white p-4 rounded-none mb-5"
                        style={{ borderColor: `${BRAND}26` }}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="saveBilling"
                            checked={shouldSaveBilling}
                            onCheckedChange={(v) => setShouldSaveBilling(!!v)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor="saveBilling"
                              className="font-semibold cursor-pointer text-slate-900"
                            >
                              Save billing address for next time
                            </Label>
                            <p className="text-xs text-slate-500 mt-1">
                              We’ll store this address on your account.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="fullName"
                          className="text-slate-700 text-xs tracking-wide uppercase"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          value={billingInfo.fullName}
                          onChange={(e) =>
                            setBillingInfo({
                              ...billingInfo,
                              fullName: e.target.value,
                            })
                          }
                          placeholder="John Doe"
                          className={cx("mt-1.5", input)}
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="address"
                          className="text-slate-700 text-xs tracking-wide uppercase"
                        >
                          Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="address"
                          value={billingInfo.address}
                          onChange={(e) =>
                            setBillingInfo({
                              ...billingInfo,
                              address: e.target.value,
                            })
                          }
                          placeholder="123 Main Street, Apartment 4B"
                          className={cx("mt-1.5", input)}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="city"
                            className="text-slate-700 text-xs tracking-wide uppercase"
                          >
                            City <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="city"
                            value={billingInfo.city}
                            onChange={(e) =>
                              setBillingInfo({
                                ...billingInfo,
                                city: e.target.value,
                              })
                            }
                            placeholder="Lagos"
                            className={cx("mt-1.5", input)}
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="state"
                            className="text-slate-700 text-xs tracking-wide uppercase"
                          >
                            State
                          </Label>
                          <select
                            id="state"
                            value={billingInfo.state}
                            onChange={(e) =>
                              setBillingInfo({
                                ...billingInfo,
                                state: e.target.value,
                              })
                            }
                            className="mt-1.5 w-full h-11 rounded-none border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:border-slate-400"
                          >
                            <option value="">Select state</option>
                            {NIGERIAN_STATES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="zipCode"
                            className="text-slate-700 text-xs tracking-wide uppercase"
                          >
                            Postal Code
                          </Label>
                          <Input
                            id="zipCode"
                            value={billingInfo.zipCode}
                            onChange={(e) =>
                              setBillingInfo({
                                ...billingInfo,
                                zipCode: e.target.value,
                              })
                            }
                            placeholder="100001"
                            className={cx("mt-1.5", input)}
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="country"
                            className="text-slate-700 text-xs tracking-wide uppercase"
                          >
                            Country
                          </Label>
                          <Input
                            id="country"
                            value={billingInfo.country}
                            onChange={(e) =>
                              setBillingInfo({
                                ...billingInfo,
                                country: e.target.value,
                              })
                            }
                            className={cx("mt-1.5", input)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right summary */}
          <div className="lg:col-span-2">
            <div className={cx(card, "sticky top-24")}>
              <div className={cardHeader}>
                <div className="flex items-center justify-between">
                  <p className={cardTitle}>Summary</p>
                  <span className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                    {cart.length} item{cart.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.cartId}
                      className="border bg-white p-3 rounded-none flex gap-3"
                      style={{ borderColor: `${BRAND}26` }}
                    >
                      <div
                        className="w-16 h-16 border bg-slate-50 rounded-none overflow-hidden shrink-0"
                        style={{ borderColor: `${BRAND}1a` }}
                      >
                        <img
                          src={item.images?.[0] || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {item.name}
                        </p>

                        {item.selectedVariant && (
                          <p className="text-[12px] text-slate-500 mt-0.5 truncate">
                            Variant:{" "}
                            <span className="text-slate-700">
                              {item.selectedVariant.name}
                            </span>
                          </p>
                        )}

                        {item.selectedExtras &&
                          item.selectedExtras.length > 0 && (
                            <p className="text-[12px] mt-1 flex items-center gap-1 text-slate-500">
                              <Package
                                className="w-3 h-3"
                                style={{ color: BRAND }}
                              />
                              +{item.selectedExtras.length} extra(s)
                            </p>
                          )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[12px] text-slate-500">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-semibold text-slate-900">
                            {formatPrice(
                              (item.selectedVariant?.price || item.price) *
                                item.quantity,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="my-4 h-px bg-slate-200/70" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-slate-500">Delivery</span>
                  <span className="font-semibold text-slate-900">FREE</span>
                </div>

                <div className="my-4 h-px bg-slate-200/70" />

                <div className="flex items-end justify-between">
                  <span className="text-sm text-slate-500">Total</span>
                  <span className="text-xl font-semibold text-slate-900 tracking-tight">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>

                <Button
                  onClick={handlePayWithPaystack}
                  disabled={loading}
                  className="w-full mt-4 h-11 rounded-none text-white font-semibold tracking-wide hover:opacity-90"
                  style={{
                    backgroundColor: BRAND,
                    opacity: loading ? 0.85 : 1,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Complete Purchase
                    </>
                  )}
                </Button>

                <div className="mt-3 flex items-center justify-center gap-2 text-[11px] tracking-[0.18em] uppercase text-slate-400">
                  <Lock className="w-3 h-3" style={{ color: BRAND }} />
                  Secured by Paystack
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom spacing */}
        <div className="h-6" />
      </div>
    </div>
  );
}
