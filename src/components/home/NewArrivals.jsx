import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NewArrivals = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3 });
  const navigate = useNavigate();

  useEffect(() => {
    if (inView) controls.start("visible");
    else controls.start("exit");
  }, [inView, controls]);

  // 🖼️ Product images (8 total including logo)
  const allImages = [
    "/Chrome-hearts.jpg",
    "/GoldBracelets.JPG",
    "/ringsonlap.jpg",
    "/Yagso-logo.png", // 👑 logo always the 4th image
    "/red-rings.jpg",
    "/green-earringlady.jpg",
    "/News1.JPG",
    "/SilverImg.JPG",
  ];

  const gridCount = allImages.length; // 8 cards

  return (
    <motion.div
      ref={ref}
      id="newarrivals-section"
      className="px-4 md:px-8 lg:px-[4rem] lg:max-w-[1300px] mx-auto py-12 flex flex-col items-center justify-center w-full overflow-hidden"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.15, duration: 0.6, ease: "easeOut" },
        },
        exit: { opacity: 0, y: -40, transition: { duration: 0.5 } },
      }}
    >
      {/* Grid */}
      <motion.div
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        className="mt-[2rem] w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      >
        {allImages.map((_, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
            }}
            whileHover={{ scale: 0.98 }}
            className="relative aspect-square border-2 border-[#debfad] overflow-hidden cursor-pointer shadow-inner"
            onClick={() => navigate(`/product/${index + 1}`)}
          >
            <ImageLooper index={index} allImages={allImages} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default NewArrivals;

// 🌀 ImageLooper Component
const ImageLooper = ({ index, allImages }) => {
  const [currentIndex, setCurrentIndex] = useState(index);
  const [bgActive, setBgActive] = useState(allImages[index].includes("Yagso"));

  useEffect(() => {
    const interval = setInterval(() => {
      // Move to next image index (loop through all 8)
      const nextIndex = (currentIndex + 1) % allImages.length;
      setCurrentIndex(nextIndex);

      // Toggle white background for logo
      setBgActive(allImages[nextIndex].includes("Yagso"));
    }, 5000); // ⏳ 5 seconds switch

    return () => clearInterval(interval);
  }, [currentIndex, allImages]);

  const currentImage = allImages[currentIndex];

  return (
    <motion.img
      key={currentImage}
      src={currentImage}
      alt={`Product ${index}`}
      className={`absolute top-0 left-0 w-full h-full object-cover transition-none ${
        bgActive ? "bg-[#f7f3ee] p-8 object-contain" : ""
      }`}
    />
  );
};
