import React from "react";
import { motion } from "framer-motion";

const LogoTicker = ({ logos = [], speed = 200 }) => {
  const repeated = [...logos, ...logos]; // double for seamless loop

  return (
    <div className="relative overflow-hidden w-full h-[60px] bg-transparent">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed / 10, // this gives us a nice medium speed
        }}
      >
        {repeated.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-8 opacity-80 hover:opacity-100 transition-all duration-300"
          >
            <img
              src={logo}
              alt={`logo-${index}`}
              className="w-[80px] h-auto object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default LogoTicker;
