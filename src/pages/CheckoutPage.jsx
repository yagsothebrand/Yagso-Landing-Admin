"use client";

import { useCart } from "@/components/cart/CartProvider";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
const SHIPPING_COST = 10000;

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { userId } = useLandingAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <Link to="/">
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please log in to complete checkout");
      navigate("/");
      return;
    }

    setIsProcessing(true);

    try {
      const checkoutId = `CHK-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
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
      const total = getCartTotal() + SHIPPING_COST;

      const checkoutData = {
        checkoutId,
        userId,
        items: cart,
        shippingInfo: formData,
        subtotal,
        savings,
        shippingCost: SHIPPING_COST,
        total,
        status: "completed",
        createdAt: serverTimestamp(),
      };

      // Save checkout to user's checkouts collection
      await setDoc(
        doc(db, "users", userId, "checkouts", checkoutId),
        checkoutData
      );

      const userRef = doc(db, "users", userId);
      await setDoc(
        userRef,
        {
          lastCheckoutId: checkoutId,
          lastCheckoutDate: serverTimestamp(),
          cart: {
            items: cart,
            total: getCartTotal(),
            shippingCost: SHIPPING_COST,
            grandTotal: total,
            updatedAt: serverTimestamp(),
          },
        },
        { merge: true }
      );

      alert("Order placed successfully! 🎉");
      await clearCart();
      navigate(`/checkout/${checkoutId}`);
    } catch (error) {
      console.error("[v0] Error processing checkout:", error);
      alert("Error processing order. Please try again.");
      setIsProcessing(false);
    }
  };

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
  const total = getCartTotal() + SHIPPING_COST;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-primary mb-8 hover:text-primary/80"
        >
          <ChevronLeft size={20} />
          <span>Continue Shopping</span>
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Shipping Information
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isProcessing && <Loader2 size={20} className="animate-spin" />}
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-muted rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.variant}`}
                    className="flex justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ₦
                      {(
                        item.price * item.quantity -
                        (item.discount
                          ? (item.price * item.quantity * item.discount) / 100
                          : 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Savings</span>
                  <span>-₦{savings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₦{SHIPPING_COST.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₦{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
