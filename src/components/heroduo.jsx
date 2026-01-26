import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/dz5adcaic/video/upload/v1768877166/that_looks_like_a_lot_of_fliers_yrtyhe.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center ">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl font-black text-white mb-8 leading-tight"
        >
          After Sex,{" "}
          <span className="bg-gradient-to-r from-[#fc7182] to-purple-400 bg-clip-text text-transparent">
            Sorted.
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#fc7182] to-[#2b6f99] hover:from-[#fc7182] hover:to-[#fc7182] text-white font-bold text-xl px-16 py-8 rounded-full shadow-2xl hover:shadow-[#fc7182]/50 transform hover:scale-105 transition-all"
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Order Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
