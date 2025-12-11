"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
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
  console.log("ProductCard props:", { id, images, category, name, price, stock, placement, ...props });
  const [showPreview, setShowPreview] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();
  const { addToCart, setIsDrawerOpen, cart } = useCart();
  const { userId } = useLandingAuth();

  const isProductInCart = cart?.some((item) => item.id === id);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleAddCart = async () => {
    // if (!userId) {
    //   triggerToast("Please log in first");
    //   navigate("/");
    //   return;
    // }

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

  const handleAddWishlist = () => {
    triggerToast("Wishlisted! 💚");
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
        <div className="relative w-full h-[18rem] bg-[#debfad]/80 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden">
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
              <p className="text-white font-bold text-lg">Out of Stock</p>
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

          {/* Placement Badge */}
          {getBadgeLabel() && (
            <div
              className={cn(
                `absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold ${getBadgeColor()}`
              )}
            >
              {getBadgeLabel()}
            </div>
          )}

          {/* Floating buttons */}
          {!isOutOfStock && (
            <div className="absolute text-[#133827] top-3 right-2 flex flex-col border border-gray-200 rounded-md overflow-hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPreview(true);
                }}
                className="bg-white/80 border-b p-2"
              >
                <Eye size={20} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate();
                }}
                className="bg-white/80 border-b p-2"
              >
                <Menu size={20} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddWishlist();
                }}
                className="bg-white/80 p-2"
              >
                <Heart size={20} />
              </motion.button>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="mt-2">
          <p className="text-gray-200 text-[12px]">{category}</p>
          <h4 className="text-[18px] text-[#debfad] font-[600]">{name}</h4>

          <p className="text-gray-300 text-[16px] font-[600]">₦{price}</p>

          <p className="text-gray-400 text-[12px] mb-2">Stock: {stock || 0}</p>

          <motion.button
            whileHover={!isOutOfStock ? { scale: 1.03 } : {}}
            whileTap={!isOutOfStock ? { scale: 0.96 } : {}}
            onClick={handleAddCart}
            disabled={isOutOfStock || isAddingToCart}
            className={cn(
              "py-2 mt-[1rem] text-[#133827] w-full rounded-xl font-semibold transition flex items-center justify-center gap-2",
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

      {createPortal(
        <>
          {toastVisible && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-[#133827] text-[#debfad] px-4 py-3 rounded-lg shadow-lg z-[100000]"
            >
              {toastMsg}
            </motion.div>
          )}
        </>,
        document.body
      )}
    </>
  );
};

export default ProductCard;
