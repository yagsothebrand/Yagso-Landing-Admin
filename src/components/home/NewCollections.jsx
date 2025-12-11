import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import gsap from "gsap";
import SplitType from "split-type";

const NewCollections = () => {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (!isInView) return;
    controls.start("visible");

    const headingSplit = new SplitType(headingRef.current, { types: "chars" });
    gsap.from(headingSplit.chars, {
      opacity: 0,
      y: 80,
      rotateX: -90,
      stagger: 0.08,
      ease: "power3.out",
      duration: 1.1,
      delay: 0.2,
    });
  }, [isInView, controls]);

  const collections = [
    {
      id: 1,
      title: "Emerald Dreams",
      subtitle: "Timeless elegance",
      image: "/emerald-dreams.JPG",
      span: "md:col-span-2 md:row-span-2",
    },
    {
      id: 2,
      title: "Golden Hour",
      subtitle: "Modern luxury",
      image: "/Newcollection1.JPG",
      span: "md:col-span-1 md:row-span-1",
    },
    {
      id: 3,
      title: "Pearl Essence",
      subtitle: "Sophisticated charm",
      image: "/pearl-essence.JPG",
      span: "md:col-span-1 md:row-span-1",
    },
    // {
    //   id: 4,
    //   title: "Midnight Stars",
    //   subtitle: "Bold & captivating",
    //   image: "/midnight.JPG",
    //   span: "md:col-span-1 md:row-span-2",
    // },
    // {
    //   id: 5,
    //   title: "Rose Garden",
    //   subtitle: "Romantic essence",
    //   image: "/rose.JPG",
    //   span: "md:col-span-2 md:row-span-1",
    // },
    // {
    //   id: 6,
    //   title: "Opal Mirage",
    //   subtitle: "Mystical flair",
    //   image: "/opal.JPG",
    //   span: "md:col-span-1 md:row-span-1",
    // },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: i * 0.1,
      },
    }),
  };

  return (
    <section
      ref={containerRef}
      className="w-full  px-[1rem] md:px-[2rem] lg:px-[4rem] z-10 bg-[#dfbfae] overflow-hidden  mx-auto"
    >
      <div className="mb-[4rem] text-center">
        <h4
          ref={headingRef}
          className="text-[42px] md:text-[56px] lg:text-[64px] font-light tracking-tight text-[#133827] mb-4"
        >
          New Arrivals
        </h4>
      </div>

      <motion.div
        initial="hidden"
        animate={controls}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
      >
        {collections.map((collection, index) => (
          <motion.div
            key={collection.id}
            custom={index}
            variants={itemVariants}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer ${collection.span}
            transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#133827]/20`}
          >
            <div className="relative w-full h-full min-h-[300px] md:min-h-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8]">
              {/* Image */}
              <motion.img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.15, rotate: -1 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />

              {/* BLUR GLASS ON HOVER */}
              <div className="absolute inset-0 bg-black/10 backdrop-blur-none group-hover:backdrop-blur-sm transition-all duration-500 pointer-events-none" />

              {/* CONTENT */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 pointer-events-none">
                <motion.div
                  initial={{ y: 0 }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-white transition-all duration-500"
                >
                  <p className="text-sm font-light tracking-widest uppercase mb-2 opacity-80">
                    Collection
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light">
                    {collection.title}
                  </h3>
                  <p className="text-sm font-light opacity-90 mt-[2px]">
                    {collection.subtitle}
                  </p>
                </motion.div>

                {/* CTA & Hidden text */}
                <div className="flex flex-col gap-2">
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="text-white flex items-center gap-2 text-sm font-light pointer-events-auto"
                  >
                    Explore
                    <span className="text-lg">→</span>
                  </motion.button>

                  {/* reveal on hover */}
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-xs font-light opacity-0 group-hover:opacity-100 pointer-events-none"
                  >
                    Hand-crafted pieces curated for elegance.
                  </motion.p>
                </div>
              </div>

              {/* BORDER */}
              <div className="absolute inset-0 rounded-2xl border border-[#debfad]/0 group-hover:border-[#debfad]/40 transition-all duration-500 pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={controls}
        className="mt-[4rem] text-center"
      >
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(19, 56, 39, 0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#133827] text-white px-12 py-4 rounded-full font-light text-lg tracking-wide hover:bg-[#0f2720] transition-colors duration-300 shadow-lg"
        >
          View All Collections
        </motion.button>
      </motion.div>
    </section>
  );
};

export default NewCollections;

// import React, { useEffect, useRef } from "react"
// import { motion, useAnimation, useInView } from "framer-motion"
// import gsap from "gsap"
// import SplitType from "split-type"

// const NewCollections = () => {
//   const containerRef = useRef(null)
//   const headingRef = useRef(null)
//   const isInView = useInView(containerRef, { once: true })
//   const controls = useAnimation()

//   useEffect(() => {
//     if (!isInView) return
//     controls.start("visible")

//     const headingSplit = new SplitType(headingRef.current, { types: "chars" })
//     gsap.from(headingSplit.chars, {
//       opacity: 0,
//       y: 80,
//       rotateX: -90,
//       stagger: 0.08,
//       ease: "power3.out",
//       duration: 1.1,
//       delay: 0.2,
//     })
//   }, [isInView, controls])

//   const collections = [
//     {
//       id: 1,
//       title: "Emerald Dreams",
//       subtitle: "Timeless elegance",
//       image: "/Newcollection1.JPG",
//       size: "large",
//       span: "md:col-span-2 md:row-span-2",
//     },
//     {
//       id: 2,
//       title: "Golden Hour",
//       subtitle: "Modern luxury",
//       image: "/Newcollection2.JPG",
//       size: "medium",
//       span: "md:col-span-1 md:row-span-1",
//     },
//     {
//       id: 3,
//       title: "Pearl Collection",
//       subtitle: "Sophisticated charm",
//       image: "/Green-ring.png",
//       size: "medium",
//       span: "md:col-span-1 md:row-span-1",
//     },
//     // {
//     //   id: 4,
//     //   title: "Midnight Stars",
//     //   subtitle: "Bold & captivating",
//     //   image: "/Newcollection1.JPG",
//     //   size: "medium",
//     //   span: "md:col-span-1 md:row-span-1",
//     // },
//     // {
//     //   id: 5,
//     //   title: "Rose Garden",
//     //   subtitle: "Romantic essence",
//     //   image: "/Newcollection2.JPG",
//     //   size: "medium",
//     //   span: "md:col-span-2 md:row-span-1",
//     // },
//   ]

//   const itemVariants = {
//     hidden: { opacity: 0, y: 40, scale: 0.95 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         duration: 0.8,
//         ease: "easeOut",
//         delay: i * 0.1,
//       },
//     }),
//   }

//   return (
//     <section
//       ref={containerRef}
//       className="w-full py-[6rem] px-[1rem] md:px-[2rem] lg:px-[4rem] z-10 bg-[#debfad]/90 overflow-hidden lg:max-w-[1200px] mx-auto"
//     >
//       <div className="mb-[4rem] text-center">
//         <h4
//           ref={headingRef}
//           className="text-[42px] md:text-[56px] lg:text-[64px] font-light tracking-tight text-[#133827] mb-4"
//         >
//           New Arrivals
//         </h4>
//         {/* <p className="text-[#666] text-lg md:text-xl font-light max-w-[500px] mx-auto">
//           Discover our latest curated pieces. Each collection tells a story of craftsmanship and elegance.
//         </p> */}
//       </div>

//       <motion.div initial="hidden" animate={controls} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
//         {collections.map((collection, index) => (
//           <motion.div
//             key={collection.id}
//             custom={index}
//             variants={itemVariants}
//             className={`group relative overflow-hidden rounded-2xl cursor-pointer ${collection.span}`}
//           >
//             <div className="relative w-full h-full min-h-[300px] md:min-h-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8]">
//               <motion.img
//                 src={collection.image}
//                 alt={collection.title}
//                 className="w-full h-full object-cover"
//                 whileHover={{ scale: 1.08 }}
//                 transition={{ duration: 0.6, ease: "easeOut" }}
//               />

//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//               <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
//                 <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 transition-transform">
//                   <p className="text-sm font-light tracking-widest uppercase mb-2">Collection</p>
//                   <h3 className="text-2xl md:text-3xl font-light">{collection.title}</h3>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
//                     <p className="text-sm font-light">{collection.subtitle}</p>
//                   </div>
//                   <motion.button
//                     whileHover={{ x: 5 }}
//                     className="text-white opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center gap-2 text-sm font-light"
//                   >
//                     Explore
//                     <span className="text-lg">→</span>
//                   </motion.button>
//                 </div>
//               </div>

//               <div className="absolute inset-0 rounded-2xl border border-[#debfad]/0 group-hover:border-[#debfad]/30 transition-all duration-500 pointer-events-none" />
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       <motion.div initial={{ opacity: 0, y: 40 }} animate={controls} className="mt-[4rem] text-center">
//         <motion.button
//           whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(19, 56, 39, 0.2)" }}
//           whileTap={{ scale: 0.95 }}
//           className="bg-[#133827] text-white px-12 py-4 rounded-full font-light text-lg tracking-wide hover:bg-[#0f2720] transition-colors duration-300 shadow-lg"
//         >
//           View All Collections
//         </motion.button>
//       </motion.div>
//     </section>
//   )
// }

// export default NewCollections
