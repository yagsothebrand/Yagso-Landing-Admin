"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

import { ChevronLeft, CheckCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";
import { db } from "@/firebase";

const CheckoutDetailPage = () => {
  const { checkoutId } = useParams();
  const { userId } = useLandingAuth();
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckout = async () => {
      if (!userId || !checkoutId) {
        navigate("/");
        return;
      }

      try {
        const checkoutRef = doc(db, "users", userId, "checkouts", checkoutId);
        const checkoutSnap = await getDoc(checkoutRef);

        if (checkoutSnap.exists()) {
          setCheckout(checkoutSnap.data());
        } else {
          console.error("Checkout not found");
          navigate("/");
        }
      } catch (error) {
        console.error("[v0] Error fetching checkout:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckout();
  }, [userId, checkoutId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">
          Loading order details...
        </p>
      </div>
    );
  }

  if (!checkout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Order not found</h1>
          <Link to="/">
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition">
              Go Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-[900px] mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-primary mb-8 hover:text-primary/80"
        >
          <ChevronLeft size={20} />
          <span>Back to Home</span>
        </Link>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-green-900">
            Order Confirmed!
          </h1>
          <p className="text-green-700">Thank you for your purchase</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg border border-border p-8 space-y-8">
          {/* Order Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-semibold">{checkout.checkoutId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold text-green-600">
                  {checkout.status || "Completed"}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="border-t border-border pt-8">
            <h2 className="text-xl font-semibold mb-4">Shipping To</h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{checkout.shippingInfo?.fullName}</p>
              <p>{checkout.shippingInfo?.address}</p>
              <p>
                {checkout.shippingInfo?.city}, {checkout.shippingInfo?.state}{" "}
                {checkout.shippingInfo?.zipCode}
              </p>
              <p>{checkout.shippingInfo?.email}</p>
              <p>{checkout.shippingInfo?.phone}</p>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-border pt-8">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {checkout.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between py-2 border-b border-border last:border-b-0"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">
                        {item.variant}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold">
                    ₦{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-border pt-8 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{checkout.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Savings</span>
              <span>-₦{checkout.savings?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₦{checkout.shippingCost?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
              <span>Total</span>
              <span>₦{checkout.total?.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="border-t border-border pt-8">
            <Link to="/" className="inline-block">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition font-semibold">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetailPage;
