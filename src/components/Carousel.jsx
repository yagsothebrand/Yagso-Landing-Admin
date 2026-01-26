"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import EarringCarousel from "./EarringCarousel";

const Carousel = () => {
  const ref = useRef(null);
  const textRef = useRef(null);
  const descRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    const titleText = textRef.current.textContent;
    const descText = descRef.current.textContent || "";
    const tl = gsap.timeline();

    // Clear both texts
    textRef.current.textContent = "";
    descRef.current.textContent = "";

    // Title typing animation
    tl.to(
      {},
      {
        duration: titleText.length * 0.08,
        onUpdate: function () {
          const progress = this.progress();
          const charsToShow = Math.floor(progress * titleText.length);
          textRef.current.textContent = titleText.substring(0, charsToShow);
        },
      },
    );

    // Description typing animation (starts after title)
    tl.to(
      {},
      {
        duration: descText.length * 0.03,
        onUpdate: function () {
          const progress = this.progress();
          const charsToShow = Math.floor(progress * descText.length);
          descRef.current.textContent = descText.substring(0, charsToShow);
        },
      },
      "+=0.2",
    );

    // Title glow effect (repeating)
    tl.to(
      textRef.current,
      {
        textShadow: "0px 0px 20px rgba(222, 191, 173, 0.9)",
        duration: 1.2,
        repeat: -1,
        repeatDelay: 0.8,
        yoyo: true,
      },
      "0.2",
    );
  }, [inView]);

  return (
    <div
      id="about-section"
      className="w-full lg:max-w-[1200px] mx-auto px-4 md:px-8 lg:px-[4rem] py-[1rem] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
    >
      <motion.div
        ref={ref}
        initial={{ x: -80, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <h6
          ref={textRef}
          className="text-[28px] sm:text-[36px] lg:text-[52px] uppercase bg-gradient-to-r from-[#0e4132] via-[#fff4ec] to-[#0e4132] bg-clip-text text-transparent font-bold tracking-wide leading-tight"
          style={{
            display: "inline-block",
          }}
        ></h6>

        <p
          ref={descRef}
          className="text-[14px] sm:text-[16px] text-[#0e4132] mt-6 leading-relaxed max-w-[500px] min-h-[120px]"
        >
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
          className="mt-8 border-2 rounded-full py-3 px-[3.5rem] border-[#0e4132] text-[#0e4132] font-semibold hover:bg-[#debfad] hover:text-[#1a1a1a] transition-all duration-300 shadow-md"
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
