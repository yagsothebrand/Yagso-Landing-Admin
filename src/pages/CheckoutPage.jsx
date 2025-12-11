import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Loader2,
  ShoppingBag,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  User,
  Lock,
  Calendar,
  Sparkles,
  CheckCircle2,
  Package,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";

const CheckoutPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
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

  const { cart } = useCart();
  const { user } = useLandingAuth();

  const SHIPPING_COST = 10000;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
    }, 2500);
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
  const total = subtotal - savings + SHIPPING_COST;

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f1ed] via-[#e8dfd7] to-[#d4c4b8] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Order Placed! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Your order has been successfully placed. You'll receive a
            confirmation email shortly.
          </p>
          <motion.button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-[#8b6f5c] text-white py-3 rounded-xl font-semibold hover:bg-[#7a5e4d] transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4c4b8] via-[#254331] to-[#d4c4b8] bg-transparent py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Back Button */}
        <motion.button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[#254331] mb-8 hover:text-[#7a5e4d] font-medium"
          whileHover={{ x: -5 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ChevronLeft size={20} />
          <span>Continue Shopping</span>
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-[#c4a68f] via-[#b89780] to-[#ad8877] rounded-2xl shadow-xl p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="w-6 h-6 text-[#254331]" />
                <h2 className="text-2xl font-bold text-[#254331]">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.variant}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md"
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
                        <p className="text-xs text-gray-500">{item.variant}</p>
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
                                  ₦
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
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
                  </motion.div>
                ))}
              </div>

              <div className="bg-[#254331]/20 backdrop-blur-sm rounded-xl p-4 space-y-3">
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

              <div className="mt-6 p-4 bg-white/50 rounded-xl">
                <p className="text-xs text-[#254331]/80 text-center leading-relaxed">
                  💡 <strong>Free returns</strong> within 30 days
                  <br />
                  🚚 <strong>Express delivery</strong> in 3-5 business days
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-[#254331]/40 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <Package className="w-8 h-8 text-[#8b6f5c]" />
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              </div>

              <div className="space-y-8">
                {/* Shipping Information */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-[#8b6f5c]" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Shipping Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8b6f5c] focus:bg-white transition-all"
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
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8b6f5c] focus:bg-white transition-all"
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
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8b6f5c] focus:bg-white transition-all"
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
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8b6f5c] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8b6f5c] focus:bg-white transition-all"
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8b6f5c] focus:bg-white transition-all"
                      />
                    </div>

                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Zip Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8b6f5c] focus:bg-white transition-all"
                    />
                  </div>
                </motion.div>

                {/* Payment Information */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5 text-[#8b6f5c]" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Payment Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8b6f5c] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8b6f5c] focus:bg-white transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          maxLength={3}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8b6f5c] focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-[#8b6f5c] to-[#7a5e4d] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      <span>Place Order Securely</span>
                    </>
                  )}
                </motion.button>

                <p className="text-center text-sm text-gray-500">
                  🔒 Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
