"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Loader2,
  ShoppingBag,
  MapPin,
  Mail,
  Phone,
  User,
  Sparkles,
  CheckCircle2,
  Package,
  FileText,
} from "lucide-react";

import { useCart } from "@/components/cart/CartProvider";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useCheckout } from "@/components/cart/CheckoutProvider";
import { useProducts } from "@/components/products/ProductsProvider";

const CheckoutPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [billingInfo, setBillingInfo] = useState(null);
  const [useSavedBilling, setUseSavedBilling] = useState(true);
  const [wantsAccount, setWantsAccount] = useState(false);

  const { cart, clearCart } = useCart();
  const { user } = useLandingAuth();
  const { reduceStock } = useProducts();
  const {
    saveOrder,
    saveBillingInfo,
    loading: checkoutLoading,
  } = useCheckout();

  const SHIPPING_COST = 10000;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Load billing info if exists
  useEffect(() => {
    if (!user?.id) return;

    const loadBillingInfo = async () => {
      const ref = doc(db, "users", user.id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setFormData((prev) => ({
          ...prev,
          email: user.email || "",
        }));
        return;
      }

      const data = snap.data();
      const email = data.email || user.email || "";

      if (data.billingInfo) {
        setBillingInfo(data.billingInfo);
        setFormData((prev) => ({
          ...prev,
          ...data.billingInfo,
          email,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          email,
        }));
      }
    };

    loadBillingInfo();
  }, [user]);

  // Load states
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: "Nigeria" }),
    })
      .then((res) => res.json())
      .then((data) => setStates(data.data.states.map((s) => s.name)))
      .catch(console.error);
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (!formData.state) return;

    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: "Nigeria", state: formData.state }),
    })
      .then((res) => res.json())
      .then((data) => setCities(data.data))
      .catch(console.error);
  }, [formData.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const savings = cart.reduce((sum, item) => {
    const discount = item.discount
      ? (item.price * item.quantity * item.discount) / 100
      : 0;
    return sum + discount;
  }, 0);

  const total = subtotal - savings + SHIPPING_COST;

  // Handle payment success
  // Replace the handlePaymentSuccess function in your CheckoutPage component
  // Starting around line ~123

  const handlePaymentSuccess = async (response) => {
    try {
      console.log("💳 Payment Success!", response);

      // Prepare complete order data
      const orderData = {
        // Order identification
        orderNumber: `YGS-${Date.now()}`,
        paymentReference: response.reference,

        // Customer information
        customerEmail: formData.email,
        customerName: formData.fullName,
        customerPhone: formData.phone,

        // Shipping address
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },

        // Order items with full details
        items: cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          variant: item.variant || null,
          quantity: item.quantity,
          unitPrice: item.price,
          discount: item.discount || 0,
          totalPrice: item.discount
            ? (item.price - (item.price * item.discount) / 100) * item.quantity
            : item.price * item.quantity,
          image: item.image,
        })),

        // Pricing breakdown
        subtotal,
        savings,
        shippingCost: SHIPPING_COST,
        totalAmount: total,

        // Order status and metadata
        status: "Processing",
        paymentStatus: "Paid",
        paymentMethod: "Paystack",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        // Additional tracking
        userId: user?.id || null,
        trackingNumber: null, // Will be updated when shipped
        estimatedDelivery: null, // Will be updated when shipped
      };

      // Save order to Firestore
      // Save order
      const result = await saveOrder(orderData, response);

      // 🔥 Reduce stock for all purchased items
      await reduceStock(cart);

      // Clear cart

      await clearCart();

      // Save billing info if requested
      if (wantsAccount && !billingInfo) {
        await saveBillingInfo({
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          email: formData.email,
        });
      }

      // Store order details for success screen
      setOrderDetails({
        orderNumber: orderData.orderNumber,
        orderId: result.orderId,
        paymentReference: response.reference,
        totalAmount: total,
        items: orderData.items,
        subtotal,
        savings,
        shippingCost: SHIPPING_COST,
        status: orderData.status,
      });

      // Clear cart

      // Show success screen
      setOrderComplete(true);

      console.log("✅ Order completed successfully!");
    } catch (error) {
      console.error("❌ Error processing payment:", error);
      alert(
        "Payment successful but there was an issue saving your order. Please contact support with reference: " +
          response.reference
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentClose = () => {
    console.log("Payment cancelled by user");
    setIsProcessing(false);
  };

  // Handle Paystack payment
  const payWithPaystack = () => {
    // Validate form
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!window.PaystackPop) {
      alert(
        "Payment system not loaded. Please refresh the page and try again."
      );
      console.error("Paystack script not loaded");
      return;
    }

    setIsProcessing(true);

    const handler = window.PaystackPop.setup({
      key: "pk_test_7060cd88fe87ef72b0eed820c0aded97a6869899",
      email: formData.email,
      amount: total * 100,
      currency: "NGN",
      ref: `YAGSO-${Math.floor(Math.random() * 1000000)}`,
      callback: function (response) {
        handlePaymentSuccess(response);
      },
      onClose: function () {
        handlePaymentClose();
      },
    });

    handler.openIframe();
  };

  // Order complete UI
  if (orderComplete && orderDetails) {
    return (
      <div className="min-h-screen bg-[#f5f1ed]/80 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full  p-8"
        >
          <div className="text-center ">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6 " />
            </motion.div>

            <h1 className="text-3xl font-bold text-[#254331] mb-3">
              Order Placed Successfully! 🎉
            </h1>

            <p className="text-[#254331] mb-6">
              Thank you for your purchase! Your order has been confirmed.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-[#254331]" />
                <span className="font-semibold">Order Number:</span>
                <span className="text-[#254331]">
                  {orderDetails.orderNumber}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-[#254331]" />
                <span className="font-semibold">Payment Reference:</span>
                <span className="text-[#254331]">
                  {orderDetails.paymentReference}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-[#254331]" />
                <span className="font-semibold">Confirmation sent to:</span>
                <span className="text-[#254331]">{formData.email}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-[#8b6f5c] text-white py-3 rounded-xl font-semibold hover:bg-[#7a5e4d] transition-colors"
              >
                Continue Shopping
              </button>

              {user && (
                <button
                  onClick={() => (window.location.href = "/account")}
                  className="w-full bg-gray-100 text-[#254331] py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  View My Orders
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main checkout page
  return (
    <div className="min-h-screen bg-white/40 py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[#254331] mb-8 hover:text-[#d4c4b8] font-medium transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Continue Shopping</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ORDER SUMMARY */}
          <div className="bg-gradient-to-br from-[#ffffff]/40 via-[#b89780]/30 to-[#ad8877]/60 rounded-2xl shadow-xl p-6 lg:sticky lg:top-8 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingBag className="w-6 h-6 text-[#254331]" />
              <h2 className="text-2xl font-bold text-[#254331]">
                Order Summary
              </h2>
            </div>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.variant}`}
                  className="bg-white/90 rounded-xl p-4 shadow-md"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {item.name}
                      </h3>
                      {item.variant && (
                        <p className="text-xs text-gray-500">{item.variant}</p>
                      )}

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </span>

                        <div className="text-right">
                          {item.discount ? (
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                ₦
                                {(
                                  (item.price -
                                    (item.price * item.discount) / 100) *
                                  item.quantity
                                ).toLocaleString()}
                              </p>
                              <p className="text-xs line-through text-gray-400">
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm font-bold text-gray-900">
                              ₦{(item.price * item.quantity).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#254331]/20 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm text-[#254331]">
                <span>Subtotal</span>
                <span className="font-semibold">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Sparkles size={14} />
                    Savings
                  </span>
                  <span>-₦{savings.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-[#254331]">
                <span>Shipping</span>
                <span className="font-semibold">
                  ₦{SHIPPING_COST.toLocaleString()}
                </span>
              </div>

              <div className="border-t-2 border-[#254331]/30 pt-3 mt-3 flex justify-between font-bold text-xl text-[#254331]">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* CHECKOUT FORM */}
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">
            {billingInfo && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Billing Information
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={useSavedBilling}
                      onChange={() => {
                        setUseSavedBilling(true);
                        setFormData((prev) => ({
                          ...prev,
                          ...billingInfo,
                        }));
                      }}
                      className="w-4 h-4 text-[#8b6f5c]"
                    />
                    <span className="text-sm">Use saved billing address</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={!useSavedBilling}
                      onChange={() => {
                        setUseSavedBilling(false);
                        setFormData((prev) => ({
                          ...prev,
                          fullName: "",
                          phone: "",
                          address: "",
                          city: "",
                          state: "",
                          zipCode: "",
                        }));
                      }}
                      className="w-4 h-4 text-[#8b6f5c]"
                    />
                    <span className="text-sm">Enter new billing address</span>
                  </label>
                </div>
              </div>
            )}

            {!user.billingInfo && (
              <div className="bg-blue-50 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantsAccount}
                    onChange={() => setWantsAccount((prev) => !prev)}
                    className="w-4 h-4 mt-0.5 text-[#8b6f5c]"
                  />
                  <div>
                    {/* <span className="text-sm font-medium">
                      Create a Yagso account
                    </span> */}
                    <p className="text-xs text-gray-600 mt-1">
                      Save your billing information for faster checkout next time
                    </p>
                  </div>
                </label>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#8b6f5c]" />
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#8b6f5c] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#8b6f5c] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#8b6f5c] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#8b6f5c] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#8b6f5c] focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#8b6f5c] focus:outline-none transition-colors"
                    required
                    disabled={!formData.state}
                  >
                    <option value="">Select City</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code (Optional)"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#8b6f5c] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={payWithPaystack}
              disabled={isProcessing || checkoutLoading}
              className="w-full bg-gradient-to-r from-[#8b6f5c] to-[#7a5e4d] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isProcessing || checkoutLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Complete Purchase - ₦{total.toLocaleString()}
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              Secured by Paystack • Your payment information is encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
