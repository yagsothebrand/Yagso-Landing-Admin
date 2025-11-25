"use client"

import { motion } from "framer-motion"
import { Star, CheckCircle } from "lucide-react"

export function SuccessScreen({ isExistingEmail, onReset }) {
  const sparkles = Array.from({ length: 30 }, (_, i) => i)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {sparkles.map((i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            opacity: 0,
            scale: 0,
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 3,
          }}
        >
          <Star className="w-3 h-3 text-green-800" />
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
            className="w-32 h-32 mx-auto mb-12 neon-text bg-gradient-to-br from-green-800 to-green-900 rounded-full flex items-center justify-center shadow-2xl"
          >
            <CheckCircle className="w-16 h-16 text-white" />
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-5xl md:text-6xl font-light bg-gradient-to-r from-green-800 to-green-900 bg-clip-text text-transparent mb-8"
          >
            {isExistingEmail ? "Welcome Back" : "Welcome to Yagso"}
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-lg neon-text text-green-800 mb-12 leading-relaxed"
          >
            {isExistingEmail ? (
              <>
                Welcome back!
                <br />
                <span className="text-base text-green-700">Your account has been verified.</span>
              </>
            ) : (
              <>
                Your exclusive passcode has been sent.
                <br />
                <span className="text-base text-green-700">Check your email for the login link and access code.</span>
                <br />
                Prepare to discover extraordinary luxury.
              </>
            )}
          </motion.p>

          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            onClick={onReset}
            className="px-10 py-4 bg-gradient-to-r from-green-700 to-green-900 text-white text-md font-light rounded-full hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
          >
            Join With Another Email
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
