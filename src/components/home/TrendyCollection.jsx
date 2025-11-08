"use client";
import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionTitle from "./SectionTitle";

const TrendyCollection = () => {
  const collections = [
    { id: 1, title: "gold", img: "/bracelets.jpg", video: "/Gold.mp4" },
    { id: 2, title: "silver", img: "/SilverImg.JPG", video: "/Silver.mp4" },
    { id: 3, title: "sets", img: "/CharmsImg.JPG", video: "/CharmsVid.mp4" },
  ];

  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.25, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div
      ref={ref}
      className="relative px-[2rem] backdrop-blur-sm py-12 md:px-[4rem] lg:px-[6rem] min-h-[50vh] flex flex-col items-center justify-center w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/CharmsBg.JPG')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-[#133827]/80 z-[1]" />

      {/* Section Title */}
      <div className="relative text-[#133827] z-[2] w-full mb-10 lg:max-w-[1200px] mx-auto lg:px-[2rem]">
        <SectionTitle title="Trendy Collections" />
      </div>

      {/* Grid Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative lg:max-w-[1200px] mx-auto z-[2] lg:px-[2rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
      >
        {collections.map((col) => (
          <motion.div
            key={col.id}
            variants={cardVariants}
            onMouseEnter={() => setHovered(col.id)}
            onMouseLeave={() => setHovered(null)}
            className="relative h-[380px] rounded-[4px] overflow-hidden shadow-lg cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Background Image */}
            <motion.img
              src={col.img}
              alt={col.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                hovered === col.id ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Background Video */}
            <motion.video
              src={col.video}
              autoPlay
              loop
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                hovered === col.id ? "opacity-0" : "opacity-100"
              }`}
            />

            {/* Text */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-white">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                className="text-xl text-[#133827] capitalize font-semibold"
              >
                {col.title}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TrendyCollection;
