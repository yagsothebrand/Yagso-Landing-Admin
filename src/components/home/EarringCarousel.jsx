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
    <div className="relative w-full lg:w-[80%] h-[320px] sm:h-[380px] md:h-[440px] flex items-center justify-center overflow-hidden">
      {/* Ear image */}
      <img
        src="/earr.png"
        alt="ear"
        className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[250px] md:h-[250px] object-center object-cover z-[5]"
      />

      {earrings.map((src, i) => (
        <motion.img
          key={i}
          src={src}
          alt={`earring-${i}`}
          className="absolute top-[40%] w-[160px] h-[160px] sm:w-[190px] sm:h-[190px] md:w-[220px] md:h-[220px] object-contain z-10"
          initial={{ opacity: 0, x: 300, y: -120, scale: 0.7 }}
          animate={
            i === activeIndex
              ? {
                  opacity: [0, 1, 1, 0],
                  x: [300, 0, -300],
                  y: [-120, 60, -120], // curved arc motion
                  scale: [0.7, 1, 0.85],
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
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#556c58]/40 via-transparent to-[#556c58]/40 z-[20]" />
    </div>
  );
};

export default EarringCarousel;