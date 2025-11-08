import React, { useEffect, useState } from "react";
import { gsap } from "gsap";

const PageReveal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("pageRevealPlayed");

    if (!hasPlayed) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          sessionStorage.setItem("pageRevealPlayed", "true");
          gsap.to(".reveal-container", {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
              setIsVisible(false);
              document.body.style.overflow = "auto";
            },
          });
        },
      });

      tl.fromTo(
        ".reveal-left",
        { x: "-100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 1.2 },
        0
      )
        .fromTo(
          ".reveal-right",
          { x: "100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 1.2 },
          0
        )
        .to(".reveal-logo", { opacity: 0, duration: 0.6, delay: 0.4 })
        .to(".reveal-container", {
          yPercent: -100,
          duration: 1.2,
          ease: "power3.inOut",
        });
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden reveal-container">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="media2.mp4" 
        autoPlay
        muted
        playsInline
      />

      {/* Overlay tint (optional for clarity) */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* Animated panels */}
      <div className="absolute inset-0 flex">
        <div className="reveal-left flex-1 bg-white/60 backdrop-blur-sm"></div>
        <div className="reveal-right flex-1 bg-white/60 backdrop-blur-sm"></div>
      </div>

      {/* Center logo */}
      <img
        src="/Yagso-logo.png" 
        alt="Yagso Logo"
        className="relative z-10 reveal-logo w-[120px] md:w-[180px] opacity-0"
        onLoad={() => gsap.to(".reveal-logo", { opacity: 1, duration: 0.8 })}
      />
    </div>
  );
};

export default PageReveal;
