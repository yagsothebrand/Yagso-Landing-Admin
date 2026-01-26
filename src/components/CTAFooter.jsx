import { motion } from "framer";
import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function CTAFooter() {
  const navigate = useNavigate();
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="max-w-3xl mx-auto px-6 mt-10 pb-20"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2b6f99] via-gray-700/50 to-[#fc7182] p-12 text-center shadow-2xl">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 w-64 h-64 bg-[#fc7182] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"
        />

        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Experience Discreet Care?
          </h3>
          <p className="text-white mb-8 text-lg">
            Explore our thoughtfully curated collection of aftercare solutions
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => navigate("/shop")}
              className="px-8 py-6 bg-white text-gray-900 hover:bg-gray-100 text-lg font-semibold rounded-full shadow-xl"
            >
              Visit the Shop
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-2 inline-block"
              >
                →
              </motion.span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}

export default CTAFooter;
