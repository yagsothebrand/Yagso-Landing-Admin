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
  Package,
  ArrowRight,
} from "lucide-react";
import { useProducts } from "./auth/ProductsProvider";
import { Link } from "react-router-dom";

const cx = (...c) => c.filter(Boolean).join(" ");

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

  const getItemTotal = (item) => {
    const basePrice = (item.selectedVariant?.price || item.price) * item.quantity;

    if (!item.selectedExtras || item.selectedExtras.length === 0) return basePrice;

    const extrasTotal = item.selectedExtras.reduce((sum, extra) => {
      const extraPrice = extra.selectedVariant?.price ?? extra.price ?? 0;
      const extraQty = extra.qty || 1;
      return sum + extraPrice * extraQty;
    }, 0);

    return basePrice + extrasTotal * item.quantity;
  };

  const clampQty = (n) => Math.max(1, n);

  return (
    <Sheet>
      {/* Trigger */}
      <SheetTrigger asChild>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            className={cx(
              "relative h-10 px-3 rounded-sm",
              "bg-[#948179] hover:bg-white",
              "border border-[#948179]/25 hover:border-[#948179]/45",
              "shadow-none",
              "group",
            )}
          >
            <ShoppingCart className="w-5 h-5 text-white group-hover:text-[#948179]" />

            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={cx(
                    "absolute -top-2 -right-2",
                    "min-w-[18px] h-[18px] px-1",
                    "rounded-sm",
                    "bg-[#948179] text-white",
                    "text-[11px] font-bold",
                    "flex items-center justify-center",
                  )}
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </SheetTrigger>

      {/* Panel */}
      {/* ✅ z-index here is important */}
      <SheetContent className="z-[10060] w-full sm:max-w-lg p-2 md:p-5 bg-white text-slate-900 border-l border-[#948179]/15">
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-[#948179]/15">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm border border-[#948179]/20 flex items-center justify-center bg-white">
                <ShoppingCart className="w-4 h-4 text-[#948179]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm tracking-[0.18em] uppercase text-[#948179]">
                  Cart
                </span>
                <span className="text-[13px] text-slate-500">
                  {cartCount} item{cartCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <Link to="/" className="shrink-0">
              <img
                src="/logs.png"
                alt="Yagso"
                className="w-[4rem] object-contain"
              />
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Empty */}
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-12 flex flex-col items-center text-center gap-4"
          >
            <div className="w-14 h-14 rounded-sm border border-[#948179]/20 bg-white flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-[#948179]" />
            </div>

            <div>
              <p className="text-base font-semibold text-slate-900">
                Your cart is empty
              </p>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Add something timeless — we’ll keep it here for you.
              </p>
            </div>

            <Link to="/shop" className="w-full">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className={cx(
                  "w-full h-11",
                  "rounded-sm",
                  "bg-[#948179] text-white",
                  "font-semibold tracking-wide",
                  "flex items-center justify-center gap-2",
                  "hover:opacity-90 transition",
                )}
              >
                Continue shopping <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.cartId}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16, height: 0 }}
                    className={cx(
                      "border border-[#948179]/15 bg-white",
                      "rounded-sm",
                      "p-3 flex gap-3",
                    )}
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-sm overflow-hidden border border-[#948179]/10 bg-slate-50 shrink-0">
                      <img
                        src={item.images?.[0] || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
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
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className={cx(
                            "p-2 -mr-2 -mt-2",
                            "text-slate-400 hover:text-red-500 transition",
                            "rounded-sm",
                          )}
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Controls + Total */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-[#948179]/20 rounded-sm overflow-hidden">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.cartId, clampQty(item.quantity - 1))
                            }
                            className="w-9 h-9 flex items-center justify-center hover:bg-[#948179]/[0.06] transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 text-[#948179]" />
                          </button>

                          <div className="w-10 h-9 flex items-center justify-center text-sm font-semibold text-slate-900">
                            {item.quantity}
                          </div>

                          <button
                            onClick={() =>
                              updateCartQuantity(item.cartId, clampQty(item.quantity + 1))
                            }
                            className="w-9 h-9 flex items-center justify-center hover:bg-[#948179]/[0.06] transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4 text-[#948179]" />
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-slate-900">
                          {formatPrice(getItemTotal(item))}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#948179]/15 bg-white">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <div className="my-4 h-px bg-[#948179]/15" />

              <div className="flex items-end justify-between">
                <span className="text-sm text-slate-500">Total</span>
                <span className="text-xl font-semibold text-slate-900 tracking-tight">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <Link to="/checkout" className="block">
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button className="w-full h-11 rounded-sm bg-[#948179] text-white hover:opacity-90 font-semibold tracking-wide">
                      Proceed to Checkout
                    </Button>
                  </motion.div>
                </Link>

                <Button
                  variant="ghost"
                  className="w-full h-11 rounded-sm text-slate-500 hover:text-slate-900 hover:bg-[#948179]/[0.06]"
                  onClick={clearCart}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-slate-400 text-center">
                Yagso • Minimal • Modern
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
