import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SectionTitle from "./SectionTitle";

const PopularCategory = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.2, triggerOnce: true });
  const controls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  const categories = [
    {
      id: 1,
      title: "earrings",
      img: "/green-earringlady.jpg",
      height: "h-[300px]",
    },
    { id: 2, title: "rings", img: "/ringsonlap.jpg", height: "h-[420px]" },
    {
      id: 3,
      title: "necklaces",
      img: "/necklace-collect.jpeg",
      height: "h-[360px]",
    },
    {
      id: 4,
      title: "bracelets",
      img: "/GoldBracelets.JPG",
      height: "h-[280px]",
    },
    { id: 5, title: "anklets", img: "/anklet.jpg", height: "h-[390px]" },
    {
      id: 6,
      title: "charms",
      img: "/necklace-noodles.jpeg",
      height: "h-[310px]",
    },
    { id: 7, title: "chains", img: "/SilverImg.JPG", height: "h-[370px]" },
    { id: 8, title: "pendants", img: "/red-rings.jpg", height: "h-[330px]" },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], // smooth gen z vibe
      },
    },
  };

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center lg:max-w-[1200px] mx-auto w-full px-[1rem] md:px-[2rem] lg:px-[4rem] mt-[4rem] py-[80px]"
    >
      <div className="w-full mb-6">
        <SectionTitle title="Popular Categories" />
      </div>

      {/* Masonry grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="columns-2 md:columns-4 gap-3 space-y-3 w-full"
      >
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            variants={cardVariants}
            whileHover={{ scale: 1.01 }}
            className={`relative ${cat.height} w-full overflow-hidden rounded-[10px] shadow-inner cursor-pointer group break-inside-avoid`}
            onClick={() => navigate(`/shop?category=${cat.title}`)}
          >
            <div
              className="w-full h-full bg-cover bg-center transition-all duration-500 group-hover:shadow-[inset_0_0_50px_rgba(0,0,0,0.4)]"
              style={{ backgroundImage: `url(${cat.img})` }}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-500 flex items-end justify-center">
              <span className="relative z-10 text-white font-semibold text-[20px] pb-5 tracking-wide capitalize">
                {cat.title}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PopularCategory;
