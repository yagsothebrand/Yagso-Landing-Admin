import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react"; // Optional icons

export default function Banner() {
  return (
    <section className="relative w-full overflow-x-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b6f99] via-[#3d7fa8] to-[#fc7182]" />

      {/* Animated mesh gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #fc7182 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, #2b6f99 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, #fc7182 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

        <motion.div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#fc7182]/10 rounded-full blur-3xl" />
      </div>

      {/* Subtle overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6  text-center text-white">
        {/* Accent badge */}

        {/* Main heading with gradient text */}
        {/* <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-extrabold leading-tight"
        >
          <span className="block">Premium Products,</span>
          <span className="block bg-gradient-to-r from-white via-white to-[#fc7182] bg-clip-text text-transparent">
            Delivered Fast
          </span>
        </motion.h1> */}

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-sm text-white/90 max-w-2xl mx-auto leading-relaxed"
        >
          Discover high-quality essentials you can trust — curated just for you.
        </motion.p>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-8 text-xs text-white/70"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#fc7182] rounded-full animate-pulse" />
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#fc7182] rounded-full animate-pulse" />
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#fc7182] rounded-full animate-pulse" />
            <span>Secure Checkout</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto text-white"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
}
