import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";
import { Gem, Lock } from "lucide-react";

import PreparingAccessLoader from "@/components/PreparingAccessLoader";

export default function Page() {
  const navigate = useNavigate();
  const { id } = useParams(); // token in URL (e.g., /auth/:id)
  const { user, token, setToken, loading } = useLandingAuth();
  const [error, setError] = useState("");
  const [passcode, setPasscode] = useState("");
  const [accessGranted, setAccessGranted] = useState(
    localStorage.getItem("accessGranted") === "true" // 👈 load from storage
  );
  // 1️⃣ Handle new tokens from the URL dynamically
  useEffect(() => {
    if (id && id !== token) {
      // New token provided via URL
      console.log("🔑 Received new token:", id);
      setToken(id);
    }
  }, [id, token, setToken]);

  // 2️⃣ Handle routing logic based on user + token status
  useEffect(() => {
    if (loading) return; // wait until Firebase fetch finishes

    if (user || id || token) {
      console.log("✅ User authenticated — redirecting home");
      navigate("/", { replace: true });
    } else if (!token || !id) {
      console.log("🚫 No token — redirecting to waitlist");
      navigate("/waitlist", { replace: true });
    } else {
      // Token exists but user not found (invalid token case)
      console.warn("⚠️ Invalid token — redirecting to waitlist");
      navigate("/waitlist", { replace: true });
    }
  }, [user, token, loading, navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (user?.passcode === passcode.trim()) {
      setAccessGranted(true);
      localStorage.setItem("accessGranted", "true"); // 👈 remember access
    } else {
      setError("Incorrect passcode. Please try again.");
    }
  };
  if (loading  && accessGranted != true) {
    return <PreparingAccessLoader />;
  }
  if (!accessGranted && token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-950 via-stone-950 to-emerald-900 relative overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1200),
              y:
                Math.random() *
                (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              delay: i * 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Gem className="w-12 h-12 text-emerald-400/20" />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md px-6 py-12 mx-4 text-center bg-stone-900/50 backdrop-blur-xl border border-emerald-800/30 rounded-3xl shadow-2xl relative z-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "backOut" }}
            className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center shadow-lg"
          >
            <Lock className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-3xl font-light tracking-wide text-emerald-100 mb-4"
          >
            Exclusive Access
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-sm text-emerald-300/70 mb-8 leading-relaxed"
          >
            Enter your 6-digit passcode from your email to unlock your exclusive
            jewelry experience
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="000000"
                value={passcode}
                onChange={(e) =>
                  setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                className="w-full px-6 py-4 bg-stone-800/50 border-2 border-emerald-700/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center text-2xl tracking-[0.5em] text-emerald-100 placeholder-emerald-800 transition-all duration-300"
                autoFocus
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -bottom-6 left-0 right-0 text-red-400 text-xs"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-2xl hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 font-light tracking-wider"
            >
              Unlock Access
            </motion.button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-8 text-xs text-emerald-400/50"
          >
            Check your email for your unique passcode
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // ✨ Real landing page
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-stone-950 to-emerald-900 text-emerald-100 relative overflow-hidden"
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1200),
              y:
                Math.random() *
                (typeof window !== "undefined" ? window.innerHeight : 800),
              scale: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2,
            }}
          >
            <Gem className="w-4 h-4 text-emerald-400" />
          </motion.div>
        ))}

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="text-center z-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: "backOut" }}
            className="w-32 h-32 mx-auto mb-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-2xl"
          >
            <Gem className="w-16 h-16 text-white" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-5xl md:text-6xl font-light text-emerald-100 mb-6"
          >
            Welcome to Yagso
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-xl text-emerald-300/80 max-w-2xl mx-auto leading-relaxed"
          >
            You've unlocked access to our exclusive jewelry collection.
            <br />
            Discover timeless pieces crafted with extraordinary care.
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
