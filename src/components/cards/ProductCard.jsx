"use client";

import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Heart, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PreviewModal from "../modals/PreviewModal";
import { addToStored } from "../../utils/localStorageHelpers";
import ToastPopup from "../ui/ToastPopup";

const ProductCard = ({
  id,
  images,
  category,
  name,
  price,
  variants,
  placement,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const navigate = useNavigate();

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleAddCart = () => {
    const success = addToStored("cart", {
      id,
      images,
      category,
      name,
      price,
      variants,
    });
    triggerToast(success ? "Added to cart! ✅" : "Already in cart 😅");
    window.dispatchEvent(new Event("storageUpdate"));
  };

  const handleAddWishlist = () => {
    const success = addToStored("wishlist", { id, images, name });
    triggerToast(success ? "Wishlisted! 💚" : "Already wishlisted 😌");
    window.dispatchEvent(new Event("storageUpdate"));
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

  return (
    <>
      <motion.div className="w-full p-1 transition-all duration-200 overflow-hidden bg-transparent">
        <div className="relative w-full h-[18rem] bg-[#debfad]/80 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden">
          {images && images[0] && (
            <motion.img
              whileHover={{ scale: 1.1 }}
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
          <div className="absolute text-[#133827] top-3 right-2 flex flex-col border border-gray-200 rounded-md overflow-hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(true);
              }}
              className="bg-white/80 border-b p-2 fade"
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
        </div>

        {/* Text */}
        <div className="mt-2">
          <p className="text-gray-200 text-[12px]">{category}</p>
          <h4 className="text-[18px] text-[#debfad] font-[600]">{name}</h4>

          {variants && variants.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-1 mb-2">
              {variants.slice(0, 3).map((variant, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-gray-700 text-gray-100 px-2 py-1 rounded"
                >
                  {variant}
                </span>
              ))}
              {variants.length > 3 && (
                <span className="text-[10px] text-gray-400">
                  +{variants.length - 3} more
                </span>
              )}
            </div>
          )}

          <p className="text-gray-300 text-[16px] font-[600]">₦{price}</p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleAddCart}
            className="bg-[#debfad] py-2 mt-[1rem] text-[#133827] w-full rounded-xl font-semibold"
          >
            Add to cart
          </motion.button>
        </div>
      </motion.div>

      {createPortal(
        <>
          <ToastPopup message={toastMsg} visible={toastVisible} />

          <AnimatePresence>
            {showPreview && (
              <PreviewModal
                img={images?.[0]}
                title={name}
                setShowPreview={setShowPreview}
              />
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </>
  );
};

export default ProductCard;
