import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import EmblaCarousel from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import ProductCard from "./ProductCard";

const RelatedProducts = () => {
  const related = [
    {
      id: 1,
      title: "Luna Studs",
      price: 80,
      img: "https://res.cloudinary.com/deywxghov/image/upload/v1760121650/download-fotor-20251010183145_mcpayu.png",
    },
    {
      id: 2,
      title: "Aurora Drops",
      price: 120,
      img: "https://res.cloudinary.com/deywxghov/image/upload/v1760121652/download-fotor-20251010191944_guluoz.png",
    },
    {
      id: 3,
      title: "Opal Hoops",
      price: 90,
      img: "https://res.cloudinary.com/deywxghov/image/upload/v1760121653/download_2_-fotor-2025101019328_obleje.png",
    },
    {
      id: 4,
      title: "Golden Halo",
      price: 150,
      img: "https://res.cloudinary.com/deywxghov/image/upload/v1760121650/download-fotor-20251010183145_mcpayu.png",
    },
  ];

  const viewportRef = useRef(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!viewportRef.current) return;

    const embla = EmblaCarousel(viewportRef.current, { loop: true }, [
      Autoplay({ delay: 2500, stopOnInteraction: false }),
    ]);

    return () => embla && embla.destroy();
  }, []);

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section
      ref={ref}
      className="px-4 md:px-8 lg:px-16 py-12 lg:max-w-[1200px] mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Related Products
      </h2>

      {/* Mobile: Embla Carousel */}
      <div className="md:hidden overflow-hidden" ref={viewportRef}>
        <div className="flex gap-4">
          {related.map((product, i) => (
            <motion.div
              key={product.id}
              className="flex-[0_0_80%]"
              variants={itemVariants}
              initial="hidden"
              animate={controls}
              custom={i}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((product, i) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            initial="hidden"
            animate={controls}
            custom={i}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
