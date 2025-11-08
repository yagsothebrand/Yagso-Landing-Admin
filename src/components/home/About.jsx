"use client";
import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const About = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("exit");
    }
  }, [inView, controls]);

  const textVariant = {
    hidden: { opacity: 0, x: -80, rotateY: 45 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: {
      opacity: 0,
      x: -100,
      rotateY: -20,
      transition: { duration: 0.8 },
    },
  };

  const imageVariant = {
    hidden: { opacity: 0, x: 80, scale: 0.9, rotateY: -45 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotateY: 0,
      transition: { duration: 1.1, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: 100,
      rotateY: 20,
      scale: 0.8,
      transition: { duration: 0.8 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }}
      className="px-4 md:px-8 lg:px-[4rem] lg:max-w-[1200px] mx-auto min-h-[50vh] flex items-center py-12 relative w-full overflow-hidden"
    >
      <div className="flex flex-col-reverse md:flex-row justify-between gap-14 w-full">
        {/* Text Section */}
        <motion.div
          variants={textVariant}
          animate={controls}
          className="w-full md:w-[40%] space-y-4"
        >
          <h2 className="heading text-bgColor text-[24px] lg:text-[34px] font-semibold pb-4">
            Crafted for Timeless Elegance
          </h2>
          <p className="text-[16px] text-[#a1a1a1ef]">
            At Yagso, every piece is shaped with meticulous detail and passion.
            Our designs reflect more than just adornment—they are crafted to
            illuminate the story and confidence of every woman who wears them.
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          variants={imageVariant}
          animate={controls}
          className="grid grid-cols-2 md:w-[60%] relative"
        >
          <motion.div
            className="w-full"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            <img
              className="w-full object-cover rounded-xl shadow-lg"
              src="/necklace-cat.jpeg"
              alt="Necklace Display"
            />
          </motion.div>

          <motion.div
            className="relative z-[30]"
            whileHover={{ scale: 1.08, rotateY: -5 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            <img
              className="w-full object-cover rounded-xl shadow-lg"
              src="/lady.png"
              alt="Lady"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;
