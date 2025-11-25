"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";

export function PasscodeVerification({
  email,
  onVerify,
  onResend,
  onBack,
  loading,
  error,
}) {
  const [passcode, setPasscode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onVerify(passcode);
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
        onClick={onBack}
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
            Welcome Back
          </h2>
          <p className="neon-text text-lg leading-relaxed text-green-800 text-center max-w-xl mx-auto">
            We found your email in our system. Please enter your exclusive
            passcode or request a new one.
          </p>
          <p className="text-sm text-green-600 mt-4">{email}</p>
        </motion.div>

        <motion.form
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Enter 6-digit passcode"
              value={passcode}
              onChange={(e) =>
                setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength="6"
              className="w-full px-6 py-5 bg-white/10 border-2 border-stone-700/30 rounded-full focus:border-green-700 focus:bg-white/20 focus:outline-none transition-all duration-300 text-green-500 placeholder-stone-500 text-lg backdrop-blur-sm text-center text-2xl tracking-widest"
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading || passcode.length !== 6}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-5 bg-gradient-to-r from-green-700 to-green-900 text-white font-semibold rounded-full shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-green-700/50 text-lg"
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
                  <span>Verifying...</span>
                </motion.div>
              ) : (
                <span>Verify Passcode</span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            type="button"
            onClick={onResend}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-white to-white text-green-600 hover:text-green-500 font-light rounded-full transition-all duration-300 disabled:opacity-50"
          >
            Resend Passcode
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
      </div>
    </motion.div>
  );
}
