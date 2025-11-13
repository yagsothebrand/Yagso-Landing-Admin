"use client";
import { useCart } from "@/components/cart/CartProvider";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";

const CartDrawer = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    cart,
    updateCartItem,
    removeFromCart,
  } = useCart();

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const basePrice = item.price * item.quantity;
      const discount = item.discount ? (basePrice * item.discount) / 100 : 0;
      return total + (basePrice - discount);
    }, 0);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
          />

          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-background shadow-2xl z-[99999] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Cart Summary</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 hover:bg-muted rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Your cart is empty
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.id}-${item.variant}`}
                    className="flex gap-3 p-3 bg-muted rounded-lg"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.variant}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.discount ? (
                          <>
                            <p className="text-sm font-semibold">
                              $
                              {(
                                item.price -
                                (item.price * item.discount) / 100
                              ).toFixed(2)}
                            </p>
                            <p className="text-xs line-through text-muted-foreground">
                              ${item.price.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-semibold">
                            ${item.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.id, item.variant)}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateCartItem(
                              item.id,
                              item.variant,
                              item.quantity - 1
                            )
                          }
                          className="p-1 hover:bg-muted-foreground/20 rounded"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartItem(
                              item.id,
                              item.variant,
                              item.quantity + 1
                            )
                          }
                          className="p-1 hover:bg-muted-foreground/20 rounded"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>
                    $
                    {cart
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Savings</span>
                  <span>
                    -$
                    {cart
                      .reduce((sum, item) => {
                        const discount = item.discount
                          ? (item.price * item.quantity * item.discount) / 100
                          : 0;
                        return sum + discount;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
