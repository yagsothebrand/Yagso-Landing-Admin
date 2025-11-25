import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import gsap from "gsap";

const videos = [
  "/GetInspired1.mp4",
  "/GetInspired2.mp4",
  "/GetInspired3.mp4",
  "/GetInspired4.mp4",
  "/GetInspired5.mp4",
];

const GetInspired = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const headingRef = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;

    // Animate ticker
    controls.start({
      x: ["0%", "-100%"],
      transition: {
        duration: 25,
        ease: "linear",
        repeat: Infinity,
      },
    });

    // Split heading text into spans
    const heading = headingRef.current;
    if (!heading) return; // ← safeguard

    const text = heading.textContent;
    heading.textContent = "";
    const letters = text.split("");
    letters.forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      if (char === " ") span.style.marginRight = "4px";
      heading.appendChild(span);
    });

    // GSAP shimmer animation
    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(heading.querySelectorAll("span"), {
      opacity: 1,
      duration: 0.5,
      stagger: 0.04,
      ease: "power2.out",
    }).to(
      heading,
      {
        backgroundPositionX: ["0%", "100%"],
        duration: 2.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      },
      "-=1"
    );
  }, [inView, controls]);

  return (
    <div ref={ref} className="relative w-full overflow-hidden bg-transparent">
      {/* ✨ Add your animated header */}

      {/* 🩶 Fade edges */}
      <div className="absolute left-0 top-0 h-full w-[80px] bg-gradient-to-r from-[#133827] via-[#133827]/60 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 h-full w-[80px] bg-gradient-to-l from-[#133827] via-[#133827]/60 to-transparent z-10 pointer-events-none"></div>

      {/* 🎥 Smooth infinite video ticker */}
      <motion.div animate={controls} className="flex">
        {[...videos, ...videos].map((video, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[300px] md:w-[340px] h-[260px] md:h-[300px] mx-3 rounded-xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-500"
          >
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default GetInspired;
