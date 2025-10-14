import { useState } from "react";

import { collection, addDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  Gem,
  Star,
} from "lucide-react";
import { db } from "@/firebase";

function generatePasscode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // clear old error
    setSuccess(false); // reset success

    try {
      const passcode = generatePasscode();

      // 1. Send Email
      const emailRes = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passcode }),
      });

      if (!emailRes.ok) {
        throw new Error("Failed to send email");
      }

      // 2. Save to Firestore
      await addDoc(collection(db, "waitlist"), {
        email,
        passcode,
        createdAt: new Date(),
        loginAttempt: 0,
      });

      // ✅ Only mark success if both worked
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  const sparkles = Array.from({ length: 30 }, (_, i) => i);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 relative overflow-hidden">
        {/* Success Sparkles */}
        {sparkles.map((i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              opacity: 0,
              scale: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Star className="w-3 h-3 text-emerald-400" />
          </motion.div>
        ))}

        <div className="min-h-screen flex items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
            className="text-center max-w-2xl"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: "backOut" }}
              className="w-32 h-32 mx-auto mb-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl"
            >
              <CheckCircle className="w-16 h-16 text-white" />
            </motion.div>

            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-5xl md:text-6xl font-light bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-8"
            >
              Welcome to Yagso
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-lg text-gray-600 mb-12 leading-relaxed"
            >
              Your exclusive passcode has been sent.
              <br />
              Prepare to discover extraordinary luxury.
            </motion.p>

            <motion.button
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              onClick={() => {
                setSuccess(false);
                setEmail("");
                setShowForm(false);
              }}
              className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-md font-small rounded-full hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
            >
              Join With Another Email
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/20 to-emerald-50/30 relative overflow-hidden">
      {/* Floating Gems */}
      {sparkles.slice(0, 15).map((i) => (
        <motion.div
          key={i}
          className="absolute opacity-10"
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1200),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 800),
          }}
          animate={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1200),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 800),
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        >
          <Gem className="w-6 h-6 text-emerald-400" />
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="min-h-screen flex flex-col">
        {/* Header Section */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 flex flex-col items-center justify-center text-center px-2 "
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "backOut" }}
            className="mb-3"
          >
            <img
              src="https://waitlist-bay-kappa.vercel.app/logo.png"
              alt="Yagso"
              className="h-32 md:h-48 object-contain filter drop-shadow-2xl"
            />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light text-gray-800 mb-8 leading-tight"
          >
            Exclusive
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              Collection
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
          >
            Be among the first to discover our most coveted pieces.
            <br />
            Limited access. Unlimited luxury.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.4, duration: 0.8, ease: "backOut" }}
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-md font-small rounded-full shadow-2xl hover:shadow-emerald-200 transition-all duration-500 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "300%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "linear",
              }}
            />
            <span className="relative z-10 flex items-center space-x-3">
              <span>Request Exclusive Access</span>
              <Gem className="w-3 h-3" />
            </span>
          </motion.button>
        </motion.div>

        {/* Form Overlay - Full Screen */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-900/95 to-emerald-800/90 backdrop-blur-xl"
            >
              {/* Close button */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowForm(false)}
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
                  <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
                    Join Our Elite Circle
                  </h2>
                  <p className="text-lg text-emerald-100 leading-relaxed">
                    Enter your email to receive your exclusive access code and
                    be notified of our most precious releases.
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
                            focusedInput
                              ? "text-emerald-400"
                              : "text-emerald-200"
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
                        className="w-full pl-16 pr-6 py-5 bg-white/10 border-2 border-emerald-200/30 rounded-full focus:border-emerald-300 focus:bg-white/20 focus:outline-none transition-all duration-300 text-white placeholder-emerald-200 text-lg backdrop-blur-sm"
                        required
                      />

                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: focusedInput ? "100%" : "0%" }}
                        className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full"
                      />
                    </motion.div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading || !email}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full py-5 bg-gradient-to-r from-white to-emerald-50 text-emerald-800 font-semibold rounded-full shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-emerald-200/50 text-lg relative overflow-hidden"
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
                            transition={{ duration: 2, repeat: Infinity }}
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
                  className="text-center mt-8 text-emerald-200 text-sm"
                >
                  <p>
                    By joining, you agree to receive exclusive updates about our
                    luxury collections.
                    <br />
                    Your privacy is as precious as our jewelry.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Gem className="w-16 h-16 text-emerald-400" />
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-10 opacity-30 z-10">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <Star className="w-12 h-12 text-emerald-400" />
        </motion.div>
      </div>
    </div>
  );
}
