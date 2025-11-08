"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import EarringCarousel from "./EarringCarousel";
import EarringShowcase from "./EarringShowcase";

const Carousel = () => {
  const ref = useRef(null);
  const textRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && textRef.current) {
      const text = textRef.current.textContent || "About Yagso";
      const tl = gsap.timeline();

      textRef.current.textContent = "";

      // Typing animation - reveal one character at a time
      tl.to(
        {},
        {
          duration: text.length * 0.08,
          onUpdate: function () {
            const progress = this.progress();
            const charsToShow = Math.floor(progress * text.length);
            textRef.current.textContent = text.substring(0, charsToShow);
          },
        }
      );

      tl.to(
        textRef.current,
        {
          textShadow: "0px 0px 20px rgba(222, 191, 173, 0.9)",
          duration: 1.2,
          repeat: -1,
          repeatDelay: 0.8,
          yoyo: true,
        },
        "0.2"
      );
    }
  }, [inView]);

  return (
    <div
      id="about-section"
      className="w-full lg:max-w-[1200px] mx-auto px-4 md:px-8 lg:px-[4rem] py-[5rem] grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
    >
      <motion.div
        ref={ref}
        initial={{ x: -80, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <h2
          ref={textRef}
          className="text-[36px] lg:text-[52px] uppercase bg-gradient-to-r from-[#debfad] via-[#fff4ec] to-[#debfad] bg-clip-text text-transparent font-bold tracking-wide leading-tight"
          style={{
            display: "inline-block",
          }}
        >
          About Yagso
        </h2>

        <p className="text-[16px] text-[#a1a1a1ef] mt-6 leading-relaxed max-w-[500px]">
          At Yagso, every piece is shaped with meticulous detail and passion.
          Our designs reflect more than just adornment—they are crafted to
          illuminate the story and confidence of every woman who wears them.
        </p>

        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 15px 30px rgba(222, 191, 173, 0.25)",
          }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 border-2 rounded-full py-3 px-[3.5rem] border-[#debfad] text-[#debfad] font-semibold hover:bg-[#debfad] hover:text-[#1a1a1a] transition-all duration-300 shadow-md"
        >
          Shop Now
        </motion.button>
      </motion.div>

      <div>
        <EarringCarousel />
      </div>
    </div>
  );
};

export default Carousel;
