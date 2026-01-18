import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const earrings = [
  "https://res.cloudinary.com/deywxghov/image/upload/v1760121650/download-fotor-20251010183145_mcpayu.png",
  "https://res.cloudinary.com/deywxghov/image/upload/v1760121652/download-fotor-20251010191944_guluoz.png",
  "https://res.cloudinary.com/deywxghov/image/upload/v1760121653/download_2_-fotor-2025101019328_obleje.png",
  "https://res.cloudinary.com/deywxghov/image/upload/c_fill,g_auto,w_auto,e_improve,e_sharpen,e_background_removal/e_dropshadow:azimuth_220;elevation_60;spread_20/f_png/v1759480529/coppertist-wu-mvNCH3DinOQ-unsplash_fgbbpm.jpg",
];

const EARRING_DURATION = 6; // seconds
const NEXT_START_DELAY = EARRING_DURATION * 0.9; // next starts after 90%

const EarringCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % earrings.length);
    }, NEXT_START_DELAY * 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Model portrait - Replace /earr.png with your uploaded portrait image path */}
      <div className="relative z-[5]">
        <img
          src="/woman.png"
          alt="model"
          className="w-full h-full object-cover object-top rounded-2xl"
        />
      </div>

      {/* Animated earrings - positioned near the ear area */}
      {earrings.map((src, i) => (
        <motion.img
          key={i}
          src={src}
          alt={`earring-${i}`}
          className="absolute w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] md:w-[200px] md:h-[200px] object-contain z-10"
          style={{
            left: "55%", // Position near the right ear
            top: "35%", // Adjust vertical position for ear level
          }}
          initial={{ opacity: 0, x: 200, y: -80, scale: 0.6, rotate: -15 }}
          animate={
            i === activeIndex
              ? {
                  opacity: [0, 1, 1, 0],
                  x: [200, 0, -200],
                  y: [-80, 40, -80],
                  scale: [0.6, 1, 0.7],
                  rotate: [-15, 0, 15],
                  transition: {
                    duration: EARRING_DURATION,
                    ease: [0.42, 0, 0.58, 1],
                  },
                }
              : {}
          }
        />
      ))}

      {/* Soft fade edges */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/20 via-transparent to-white/20 z-[20]" />
    </div>
  );
};

export default EarringCarousel;
