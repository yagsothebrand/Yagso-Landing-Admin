"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Gem } from "lucide-react"

export function HeroSection({ showForm, onShowForm, heroRef }) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          className="flex items-center justify-center mb-72"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <img
            src="/logo.png"
            alt="Yagso"
            width={1000}
            height={550}
            className="w-auto h-40 md:h-70 drop-shadow-2xl"
            priority
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {!showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
            
              <motion.p
                className="text-xl md:text-2xl text-stone-300 font-light mb-16 leading-relaxed max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                {" "}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                onClick={onShowForm}
                className="px-5 py-5 bg-green-50 hover:bg-white text-green-900 text-base rounded-full shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-white/20 font-light tracking-wider inline-flex items-center space-x-3"
              >
                <span>Request Exclusive Access</span>
                <Gem className="w-5 h-5 text-green-800" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
