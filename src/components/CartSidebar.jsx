import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  X,
  Truck,
  Gift,
  Sparkles,
} from "lucide-react";
import { useProducts } from "./auth/ProductsProvider";

export default function CartSidebar() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    formatPrice,
  } = useProducts();

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="relative bg-gradient-to-r from-[#2b6f99] to-[#4a8ab8] hover:from-[#1e5577] hover:to-[#2b6f99] text-white shadow-lg shadow-[#2b6f99]/25">
            <ShoppingCart className="w-5 h-5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#fc7182] to-[#ff9a9e] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col bg-gradient-to-b from-white to-slate-50">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2b6f99] to-[#4a8ab8] flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#2b6f99] to-[#fc7182] bg-clip-text text-transparent">
              Your Cart
            </span>
            <span className="text-slate-400 font-normal text-base">
              ({cartCount})
            </span>
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-6"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-6">
              <ShoppingCart className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-700 text-lg font-semibold">
              Your cart is empty
            </p>
            <p className="text-slate-400 text-sm mt-2 max-w-xs">
              Discover our amazing care packages and gifts to send love to
              someone special!
            </p>
          </motion.div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    key={item.cartId}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.images?.[0] || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 line-clamp-1 text-sm">
                        {item.name}
                      </h4>
                      {item.selectedVariant && (
                        <p className="text-xs text-[#2b6f99] font-medium mt-0.5">
                          {item.selectedVariant.name}
                        </p>
                      )}
                      {item.customFields &&
                        Object.keys(item.customFields).length > 0 && (
                          <div className="mt-1 p-2 bg-gradient-to-r from-[#2b6f99]/5 to-[#fc7182]/5 rounded-lg">
                            <p className="text-xs font-medium text-[#2b6f99] flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Personalized:
                            </p>
                            {Object.entries(item.customFields).map(
                              ([key, value]) => (
                                <p
                                  key={key}
                                  className="text-xs text-slate-600 truncate mt-0.5"
                                >
                                  {key}: {value}
                                </p>
                              ),
                            )}
                          </div>
                        )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateCartQuantity(item.cartId, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                          >
                            <Minus className="w-3 h-3" />
                          </motion.button>
                          <span className="w-8 text-center font-semibold text-sm">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateCartQuantity(item.cartId, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <p className="text-[#fc7182] font-bold mt-2 text-sm">
                        {formatPrice(
                          (item.selectedVariant?.price || item.price) *
                            item.quantity,
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t pt-4 space-y-4">
              {/* Free Delivery Banner */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-700 text-sm">
                    Free Delivery!
                  </p>
                  <p className="text-xs text-green-600">
                    On all orders, nationwide
                  </p>
                </div>
              </motion.div>

              {/* Order Summary */}
              <div className="space-y-2 py-3 border-y border-dashed">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span className="flex items-center gap-1">
                    <Gift className="w-4 h-4" />
                    Delivery
                  </span>
                  <span>FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#fc7182] to-[#ff9a9e] bg-clip-text text-transparent">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="w-full bg-gradient-to-r from-[#fc7182] to-[#ff9a9e] hover:from-[#e5657a] hover:to-[#fc7182] text-white h-12 text-lg font-bold shadow-lg shadow-[#fc7182]/25">
                  Proceed to Checkout
                </Button>
              </motion.div>

              <Button
                variant="ghost"
                className="w-full text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                onClick={clearCart}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
