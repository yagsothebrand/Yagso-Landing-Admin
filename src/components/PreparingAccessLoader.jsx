"use client";

import { motion } from "framer-motion";
import { Loader2, Gem, Sparkles } from "lucide-react";

export default function PreparingAccessLoader() {
  const gems = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-950 via-stone-950 to-emerald-900 relative overflow-hidden">
      {gems.map((i) => (
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
            opacity: 0,
          }}
          animate={{
            y: [null, -50, 0, -30, 0],
            opacity: [0, 0.3, 0.1, 0.2, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            delay: i * 0.3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Gem className="w-8 h-8 text-emerald-400/30" />
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="relative z-10"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="relative w-32 h-32 mb-8"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `rotate(${i * 60}deg) translateY(-50px)`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </motion.div>
          ))}

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Loader2 className="w-12 h-12 text-emerald-500" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="text-lg tracking-[0.3em] uppercase font-light text-emerald-300 mb-2"
          >
            Preparing
          </motion.p>
          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2,
              delay: 0.3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="text-sm tracking-widest uppercase font-light text-emerald-400/70"
          >
            Your Exclusive Access
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent"
          animate={{ x: [-200, 200] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
      />
    </div>
  );
}
