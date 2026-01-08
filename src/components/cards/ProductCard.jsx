"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Heart, Menu, Loader2 } from "lucide-react";

import { useCart } from "../cart/CartProvider";
import { useLandingAuth } from "../landingauth/LandingAuthProvider";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  id,
  images,
  category,
  name,
  price,
  stock,
  placement,
  ...props
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { addToCart, setIsDrawerOpen, cart } = useCart();
  const { userId } = useLandingAuth();

  const isProductInCart = cart?.some((item) => item.id === id);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-NG').format(amount);
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleAddCart = async () => {
    if (!stock || stock <= 0) {
      triggerToast("Out of stock 😞");
      return;
    }

    setIsAddingToCart(true);

    try {
      const product = {
        id,
        images,
        category,
        name,
        price,
        stock,
        ...props,
      };

      addToCart(product, 1);
      triggerToast("Added to cart! ✅");
    } catch (error) {
      console.error("[v0] Error adding to cart:", error);
      triggerToast("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    document.body.style.overflow = showPreview ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showPreview]);

  const getBadgeColor = () => {
    switch (placement) {
      case "best-sellers":
        return "bg-red-500";
      case "new-arrivals":
        return "bg-green-500";
      case "featured":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getBadgeLabel = () => {
    switch (placement) {
      case "best-sellers":
        return "🔥 Best Seller";
      case "new-arrivals":
        return "✨ New";
      case "featured":
        return "⭐ Featured";
      default:
        return null;
    }
  };

  const isOutOfStock = stock === undefined || stock === null || stock <= 0;

  return (
    <>
      <motion.div className="w-full p-1 transition-all duration-200 overflow-hidden bg-transparent">
        <div className="relative w-full h-[16rem] sm:h-[17rem] md:h-[18rem] bg-[#debfad]/80 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden">
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
              <p className="text-white font-bold text-base md:text-lg">Out of Stock</p>
            </div>
          )}

          {images && images[0] && (
            <motion.img
              whileHover={!isOutOfStock ? { scale: 1.1 } : {}}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full object-contain rounded-[8px]"
              src={images[0]}
              alt={name}
            />
          )}

          {getBadgeLabel() && (
            <div
              className={cn(
                `absolute top-2 left-2 md:top-3 md:left-3 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-white text-[10px] md:text-xs font-bold ${getBadgeColor()}`
              )}
            >
              {getBadgeLabel()}
            </div>
          )}

          {!isOutOfStock && (
            <div className="absolute text-[#133827] top-2 right-2 md:top-3 md:right-2 flex flex-col border border-gray-200 rounded-md overflow-hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPreview(true);
                }}
                className="bg-white/80 border-b p-1.5 md:p-2"
              >
                <Eye size={18} className="md:w-5 md:h-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate();
                }}
                className="bg-white/80 border-b p-1.5 md:p-2"
              >
                <Menu size={18} className="md:w-5 md:h-5" />
              </motion.button>
            </div>
          )}
        </div>

        <div className="mt-2">
          <p className="text-gray-200 text-[11px] md:text-[12px]">{category}</p>
          <h4 className="text-[16px] md:text-[18px] text-[#0e4132] font-[600]">{name}</h4>
          <p className="text-[14px] md:text-[16px] text-[#0e4132] font-[600]">₦{formatPrice(price)}</p>
          <p className="text-[11px] md:text-[12px] text-[#0e4132] mb-2">Stock: {stock || 0}</p>

          <motion.button
            whileHover={!isOutOfStock ? { scale: 1.03 } : {}}
            whileTap={!isOutOfStock ? { scale: 0.96 } : {}}
            onClick={handleAddCart}
            disabled={isOutOfStock || isAddingToCart}
            className={cn(
              "py-2 mt-[1rem] text-[#133827] w-full rounded-xl text-sm md:text-base font-semibold transition flex items-center justify-center gap-2",
              isOutOfStock
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-[#debfad] hover:bg-[#debfad]/90"
            )}
          >
            {isAddingToCart && <Loader2 size={16} className="animate-spin" />}
            {isOutOfStock
              ? "Out of Stock"
              : isProductInCart
              ? "In Cart ✓"
              : "Add to cart"}
          </motion.button>
        </div>
      </motion.div>

      {typeof document !== 'undefined' && createPortal(
        <>
          {toastVisible && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-[#133827] text-[#debfad] px-4 py-3 rounded-lg shadow-lg z-[100000] text-sm md:text-base"
            >
              {toastMsg}
            </motion.div>
          )}

          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPreview(false)}
                className="fixed inset-0 bg-[#debfad]/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-3 md:p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#ffffff]/80 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
                >
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
                    <div className="bg-[#bda290]/70 rounded-xl p-4 md:p-6 flex flex-col gap-3 md:gap-4">
                      <div className="flex items-center justify-center min-h-[250px] md:min-h-[300px]">
                        {images && images[currentImageIndex] && (
                          <img
                            src={images[currentImageIndex]}
                            alt={name}
                            className="max-h-[300px] md:max-h-[400px] object-contain rounded-lg"
                          />
                        )}
                      </div>
                      
                      {images && images.length > 1 && (
                        <div className="flex gap-2 justify-center">
                          {images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={cn(
                                "w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition",
                                currentImageIndex === idx
                                  ? "border-[#debfad]"
                                  : "border-transparent opacity-60 hover:opacity-100"
                              )}
                            >
                              <img
                                src={img}
                                alt={`${name} ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 md:gap-4">
                      <div>
                        <p className="text-[#debfad]/70 text-xs md:text-sm mb-1">{category}</p>
                        <h2 className="text-xl md:text-2xl font-bold text-[#debfad] mb-2">{name}</h2>
                        <p className="text-2xl md:text-3xl font-bold text-[#debfad]">₦{formatPrice(price)}</p>
                      </div>

                      <div className="flex items-center gap-4 py-2 md:py-3 border-y border-[#debfad]/20">
                        <span className="text-gray-300 text-xs md:text-sm">Stock:</span>
                        <span className={cn(
                          "font-semibold text-sm md:text-base",
                          isOutOfStock ? "text-red-400" : "text-green-400"
                        )}>
                          {isOutOfStock ? "Out of Stock" : `${stock} available`}
                        </span>
                      </div>

                      {getBadgeLabel() && (
                        <div className="flex gap-2">
                          <span className={cn(
                            "px-2 py-0.5 md:px-3 md:py-1 rounded-full text-white text-[10px] md:text-xs font-bold",
                            getBadgeColor()
                          )}>
                            {getBadgeLabel()}
                          </span>
                        </div>
                      )}

                      <div className="flex gap-3 mt-auto">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddCart}
                          disabled={isOutOfStock || isAddingToCart}
                          className={cn(
                            "flex-1 py-2.5 md:py-3 rounded-xl text-sm md:text-base font-semibold flex items-center justify-center gap-2",
                            isOutOfStock
                              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                              : "bg-[#debfad] text-[#133827] hover:bg-[#debfad]/90"
                          )}
                        >
                          {isAddingToCart && <Loader2 size={18} className="animate-spin" />}
                          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                        </motion.button>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={handleNavigate}
                        className="w-full py-2 text-sm md:text-base text-[#debfad] border border-[#debfad]/30 rounded-xl hover:bg-[#debfad]/10"
                      >
                        View Full Details
                      </motion.button>

                      <button
                        onClick={() => setShowPreview(false)}
                        className="text-gray-400 hover:text-[#debfad] text-xs md:text-sm mt-2"
                      >
                        Close Preview
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </>
  );
};

export default ProductCard;