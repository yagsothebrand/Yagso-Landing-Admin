"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, AlertCircle } from "lucide-react";

export function EmailForm({ onSubmit, loading, error, onClose }) {
  const [email, setEmail] = useState("");
  const [focusedInput, setFocusedInput] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(email);
    setEmail("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
    >
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onClose}
        className="absolute top-8 right-8 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-2xl font-light transition-all duration-300"
      >
        ×
      </motion.button>

      <div className="max-w-lg w-full mx-auto px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-light text-green-700 mb-6">
            Join Our Elite Circle
          </h2>
          <p className="neon-text text-lg leading-relaxed text-green-800 text-center max-w-xl mx-auto">
            Enter your email to receive your exclusive access code and be
            notified of our most precious releases.
          </p>
        </motion.div>

        <motion.form
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="relative">
            <motion.div
              animate={focusedInput ? { scale: 1.02 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Mail
                  className={`w-6 h-6 transition-colors duration-300 ${
                    focusedInput ? "text-green-700" : "text-stone-400"
                  }`}
                />
              </div>

              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedInput(true)}
                onBlur={() => setFocusedInput(false)}
                className="w-full pl-16 pr-6 py-5 bg-white/10 border-2 border-stone-700/30 rounded-full focus:border-green-700 focus:bg-white/20 focus:outline-none transition-all duration-300 text-green-500 placeholder-stone-500 text-lg backdrop-blur-sm"
                required
              />

              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: focusedInput ? "100%" : "0%" }}
                className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-green-800 to-green-900 rounded-full"
              />
            </motion.div>
          </div>

          <motion.button
            type="submit"
            disabled={loading || !email}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-5 bg-gradient-to-r from-green-700 to-green-900 text-white font-semibold rounded-full shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-green-700/50 text-lg relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center space-x-3"
                >
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Securing Your Access...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center space-x-3"
                >
                  <span>Reserve My Exclusive Access</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    →
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center space-x-2 text-red-300 bg-red-900/30 p-4 rounded-2xl backdrop-blur-sm"
              >
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center neon-text mt-8 text-green-400 text-sm"
        >
          <p>
            By joining, you agree to receive exclusive updates about our luxury
            collections.
            <br />
            Your privacy is as precious as our jewelry.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
