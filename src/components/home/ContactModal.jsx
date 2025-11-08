import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ContactModal = ({ setShowContact }) => {
  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[900]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowContact(false)}
      />

      {/* Sliding Contact Form */}
      <motion.div
        className="fixed top-0 bottom-0 right-0 h-full w-[90vw] sm:w-[500px] bg-[#debfad]/90 backdrop-blur-xl shadow-2xl z-[1001] p-6 overflow-y-auto border-l border-[#debfad]"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <motion.h2
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-2xl font-semibold text-[#133827]"
          >
            Contact Us
          </motion.h2>

          <motion.button
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-[#133827]/80 hover:text-[#133827] text-3xl font-bold"
            onClick={() => setShowContact(false)}
          >
            ×
          </motion.button>
        </div>

        {/* 🎥 Video Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full h-[120px] rounded-lg overflow-hidden mb-6"
        >
          <video
            src="/media.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* 📞 Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8 space-y-2 text-[#133827]"
        >
          {/* <p className="font-medium">📍 14 Heritage Lane, Lagos, Nigeria</p> */}
          <p className="font-medium">📞 +234 812 345 6789</p>
          <p className="font-medium">✉️ yagso@support.com</p>
          <p className="font-medium">🕓 Mon - Fri: 9:00 AM - 6:00 PM</p>
        </motion.div>

        {/* 📝 Contact Form */}
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Message sent ✅");
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-[#133827]">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-[#133827]/30 rounded-lg focus:ring-2 focus:ring-[#133827] outline-none bg-white/80"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#133827]">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full p-3 border border-[#133827]/30 rounded-lg focus:ring-2 focus:ring-[#133827] outline-none bg-white/80"
              placeholder="Your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#133827]">
              Message
            </label>
            <textarea
              rows="4"
              required
              className="w-full p-3 border border-[#133827]/30 rounded-lg focus:ring-2 focus:ring-[#133827] outline-none bg-white/80"
              placeholder="What would you like to tell us?"
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-[#133827] text-[#debfad] py-3 rounded-lg font-medium shadow-md hover:bg-[#102b1f] transition-all duration-300"
          >
            Send Message
          </motion.button>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactModal;
