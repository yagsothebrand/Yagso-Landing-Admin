import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastPopup = ({ message, visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed top-4 right-4 bg-[#133827] text-white py-3 px-5 rounded-xl shadow-xl z-[99999]"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastPopup;
