"use client";

import { motion } from "framer-motion";
import { Gem } from "lucide-react";

export function Sparkles() {
  const sparkles = Array.from({ length: 15 }, (_, i) => i);

  return (
    <>
      {sparkles.map((i) => (
        <motion.div
          key={i}
          className="absolute opacity-10 z-5"
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
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
        >
          <Gem className="w-6 h-6 text-green-800" />
        </motion.div>
      ))}
    </>
  );
}
