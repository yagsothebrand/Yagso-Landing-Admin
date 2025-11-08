import { X } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const PreviewModal = ({ img, title, setShowPreview }) => {
  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-md z-[9999] flex items-center justify-center"
      onClick={() => setShowPreview(false)}
    >
      <motion.div
        key="image-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="relative w-screen h-screen flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img}
          alt={title}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        />

        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPreview(false)}
          className="absolute top-[10rem] right-6 bg-white/40 hover:bg-white/60 text-black rounded-full p-1.5 transition"
        >
          <X size={20} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default PreviewModal;
