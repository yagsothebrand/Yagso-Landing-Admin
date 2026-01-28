import React from "react";

const CREAM = "#fbfaf8";

export default function YagsoVideoSection() {
  return (
    <section className="relative  w-full overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        src="ultra.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* <source
          src="shop.mp4"
          type="video/mp4"
        /> */}
      </video>

      {/* Backdrop Blur Overlay with Brand Color */}
      <div className="absolute inset-0 bg-[#948179]/10 backdrop-blur-sm bg-opacity-40"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center">
        {/* Brand Name */}
        <div className="mb-6 overflow-hidden">
          <h3
            className="text-xl md:text-4xl font-light tracking-[0.3em] uppercase"
            style={{
              color: CREAM,
              fontFamily: "'Cormorant Garamond', serif",
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              animation: "fadeInUp 1.2s ease-out",
            }}
          >
            Discover Your Signature Piece
          </h3>
        </div>

        {/* Decorative Line */}
        <div className="flex items-center justify-center mb-6">
          <div
            className="h-px w-20 opacity-60"
            style={{
              backgroundColor: CREAM,
              animation: "expandWidth 1s ease-out 0.5s both",
            }}
          ></div>
          <div
            className="w-1.5 h-1.5 mx-4 rotate-45 opacity-80"
            style={{
              backgroundColor: CREAM,
              animation: "fadeIn 1s ease-out 0.8s both",
            }}
          ></div>
          <div
            className="h-px w-20 opacity-60"
            style={{
              backgroundColor: CREAM,
              animation: "expandWidth 1s ease-out 0.5s both",
            }}
          ></div>
        </div>

        {/* Main Copy */}
        <div
          className="space-y-4 mb-8"
          style={{ animation: "fadeIn 1.5s ease-out 0.8s both" }}
        >
          <p
            className="text-base md:text-lg leading-relaxed tracking-wide"
            style={{
              color: CREAM,
              fontFamily: "'Crimson Text', serif",
              textShadow: "0 1px 10px rgba(0,0,0,0.4)",
            }}
          >
            At Yagso, every piece is shaped with meticulous detail and passion.
          </p>
          <p
            className="text-base md:text-lg leading-relaxed tracking-wide"
            style={{
              color: CREAM,
              fontFamily: "'Crimson Text', serif",
              textShadow: "0 1px 10px rgba(0,0,0,0.4)",
            }}
          >
            Our designs reflect more than just adornment—they are crafted to
            <br className="hidden md:block" />
            illuminate the story and confidence of every woman who wears them.
          </p>
        </div>

        {/* Call to Action */}
        <button
          className="group relative px-8 py-3 overflow-hidden transition-all duration-500 hover:scale-105"
          style={{
            backgroundColor: "#ffffff",
            border: `1px solid ${CREAM}`,
            color: CREAM,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            animation: "fadeIn 1.8s ease-out 1.2s both",
          }}
        >
          <span className="relative z-10 transition-colors duration-500 text-[#948179]">
            Explore Collection
          </span>
          <div
            className="absolute inset-0 transform translate-y-full transition-transform duration-500 group-hover:translate-y-0"
            style={{ backgroundColor: CREAM }}
          ></div>
        </button>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Crimson+Text:wght@400;600&display=swap");

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 5rem;
          }
        }
      `}</style>
    </section>
  );
}
