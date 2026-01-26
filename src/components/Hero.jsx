import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70"
        >
          <source
            src="https://res.cloudinary.com/dz5adcaic/video/upload/v1768877166/that_looks_like_a_lot_of_fliers_yrtyhe.mp4"
            type="video/mp4"
          />
        </video>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-black/15 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl text-white mb-2 leading-tight"
        >
          After Sex, <span className="text-[#fc7182]">Sorted.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl text-white max-w-2xl mx-auto"
        >
          Discreet emergency contraception delivered to your door
        </motion.p>
      </div>

      {/* Scroll Down Arrow */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <button
          type="button"
          onClick={scrollToProducts}
          className="group flex flex-col items-center gap-2 text-white hover:text-[#fc7182] transition-colors"
          aria-label="Scroll to products"
        >
          <span className="text-sm font-medium">Shop Now</span>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-10 h-10 rounded-full border-2 border-[#fc7182] flex items-center justify-center group-hover:bg-[#fc7182] group-hover:border-[#fc7182] transition-all"
          >
            <ChevronDown className="w-6 h-6 group-hover:text-white transition-colors" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
}
