"use client";

import { useCart } from "@/components/cart/CartProvider";
import { useCheckout } from "@/components/cart/CheckoutProvider";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    cart,
    updateCartItem,
    removeFromCart,
    getCartTotal,
  } = useCart();

  const { getCheckoutId, loading } = useCheckout();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setIsDrawerOpen(false);

    const checkoutId = await getCheckoutId();

    navigate(`/checkout/${checkoutId}`);
  };
  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[99998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-[440px] bg-gradient-to-br from-[#c4a68f] via-[#b89780] to-[#ad8877] shadow-2xl z-[99999] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
          >
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#254331]/10 to-transparent pointer-events-none" />

            {/* Header */}
            <motion.div
              className="relative flex justify-between items-center p-6 border-b border-[#254331]/20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <ShoppingBag className="text-[#254331]" size={24} />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-[#254331]">Your Cart</h2>
                  <p className="text-sm text-[#254331]/80">{cart.length} items</p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-[#254331]/20 rounded-lg transition-colors text-[#254331]"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </motion.div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-[#254331]/70"
                >
                  <ShoppingBag size={64} className="mb-4 opacity-50" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="text-sm mt-2">Add some items to get started</p>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.variant}`}
                      custom={index}
                      // variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="relative bg-[#254331]/95 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      {/* Discount Badge */}
                      {item.discount > 0 && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                          className="absolute -top-2 -right-2 bg-red-500 text-[#254331] px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10"
                        >
                          <Sparkles size={12} />
                          {item.discount}% OFF
                        </motion.div>
                      )}

                      <div className="flex gap-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="relative"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg shadow-md"
                          />
                          {item.stock < 5 && (
                            <div className="absolute bottom-1 left-1 right-1 bg-orange-500 text-[#254331] text-[10px] font-bold text-center py-0.5 rounded">
                              Low Stock
                            </div>
                          )}
                        </motion.div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base leading-tight">
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.variant}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {item.stock} in stock
                            </p>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            {item.discount ? (
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                  ₦
                                  {(
                                    item.price -
                                    (item.price * item.discount) / 100
                                  ).toLocaleString()}
                                </span>
                                <span className="text-sm line-through text-gray-400">
                                  ₦{item.price.toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">
                                ₦{item.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity & Delete */}
                        <div className="flex flex-col items-end justify-between">
                          <motion.button
                            onClick={() =>
                              removeFromCart(item.id, item.variant)
                            }
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={18} />
                          </motion.button>

                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <motion.button
                              onClick={() =>
                                updateCartItem(
                                  item.id,
                                  item.variant,
                                  item.quantity - 1
                                )
                              }
                              className="p-1.5 hover:bg-[#254331] rounded transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              disabled={item.quantity <= 1}
                            >
                              <Minus
                                size={16}
                                className={
                                  item.quantity <= 1
                                    ? "text-gray-300"
                                    : "text-gray-700"
                                }
                              />
                            </motion.button>
                            <span className="text-sm font-bold w-8 text-center text-gray-900">
                              {item.quantity}
                            </span>
                            <motion.button
                              onClick={() =>
                                updateCartItem(
                                  item.id,
                                  item.variant,
                                  item.quantity + 1
                                )
                              }
                              disabled={item.quantity >= item.stock}
                              className="p-1.5 hover:bg-[#254331] rounded transition-colors disabled:opacity-40"
                              whileHover={{
                                scale: item.quantity < item.stock ? 1.1 : 1,
                              }}
                              whileTap={{
                                scale: item.quantity < item.stock ? 0.9 : 1,
                              }}
                            >
                              <Plus size={16} className="text-gray-700" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <motion.div
                className="relative border-t border-[#254331]/20 p-6 space-y-4 bg-gradient-to-b from-transparent to-black/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-3 bg-[#254331]/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex justify-between text-sm text-[#254331]/90">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ₦
                      {cart
                        .reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                        .toLocaleString()}
                    </span>
                  </div>

                  {cart.some((item) => item.discount > 0) && (
                    <motion.div
                      className="flex justify-between text-sm text-green-300 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span className="flex items-center gap-1">
                        <Sparkles size={14} />
                        You Save
                      </span>
                      <span>
                        -₦
                        {cart
                          .reduce((sum, item) => {
                            const discount = item.discount
                              ? (item.price * item.quantity * item.discount) /
                                100
                              : 0;
                            return sum + discount;
                          }, 0)
                          .toLocaleString()}
                      </span>
                    </motion.div>
                  )}

                  <div className="flex justify-between font-bold text-xl pt-3 border-t border-[#254331]/30 text-[#254331]">
                    <span>Total</span>
                    <span>₦{getCartTotal().toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1 bg-[#254331]/20 backdrop-blur-sm text-[#254331] py-3 rounded-xl font-semibold hover:bg-[#254331]/30 transition-colors border border-[#254331]/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Shopping
                  </motion.button>
                  <motion.button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="flex-1 bg-[#254331] text-[#8b6f5c] py-3 rounded-xl font-bold hover:bg-[#254331]/90 transition-colors shadow-lg disabled:opacity-70"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Processing...
                      </motion.span>
                    ) : (
                      "Checkout"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export { CartDrawer };
export default CartDrawer;
