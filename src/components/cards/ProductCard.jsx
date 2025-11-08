import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Heart, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PreviewModal from "../modals/PreviewModal";
import { addToStored } from "../../utils/localStorageHelpers";
import ToastPopup from "../ui/ToastPopup";

const ProductCard = ({ id, img, category, title, price }) => {
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
    const success = addToStored("cart", { id, img, category, title, price });
    triggerToast(success ? "Added to cart! ✅" : "Already in cart 😅");
    window.dispatchEvent(new Event("storageUpdate"));
  };

  const handleAddWishlist = () => {
    const success = addToStored("wishlist", { id, img, title });
    triggerToast(success ? "Wishlisted! 💚" : "Already wishlisted 😌");
    window.dispatchEvent(new Event("storageUpdate"));
  };

  const handleNavigate = () => {
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/product/${slug}`, { state: { id } });
  };

  useEffect(() => {
    document.body.style.overflow = showPreview ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showPreview]);

  return (
    <>
      <motion.div className="w-full p-1 transition-all duration-200 overflow-hidden bg-transparent">
        <div className="relative w-full h-[18rem] bg-[#debfad]/80 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden">
          {img && (
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full object-contain rounded-[8px]"
              src={img}
              alt={title}
            />
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
          <p className="text-gray-400 text-[12px]">{category}</p>
          <h4 className="text-[18px] font-[600]">{title}</h4>
          <p className="text-gray-500 text-[16px] font-[600]">${price}</p>

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
                img={img}
                title={title}
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
