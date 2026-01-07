import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import EmblaCarousel from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import ProductCard from "./ProductCard";
import { useProducts } from "@/components/products/ProductsProvider";

const RelatedProducts = ({ currentProduct }) => {
  const { products } = useProducts();
  const viewportRef = useRef(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Filter products by same category
  let related = [];

  if (products?.length) {
    if (currentProduct?.category) {
      related = products.filter(
        (p) =>
          p?.category === currentProduct.category && p.id !== currentProduct.id
      );
    }

    // Fallback to random products if no category or not enough related ones
    if (products && related.length < 4) {
      const others = products.filter((p) => p.id !== currentProduct?.id);
      while (related.length < 4 && others.length > 0) {
        const randIndex = Math.floor(Math.random() * others.length);
        related.push(others.splice(randIndex, 1)[0]);
      }
    }
  }

  useEffect(() => {
    if (!viewportRef.current) return;

    const embla = EmblaCarousel(viewportRef.current, { 
      loop: true,
      align: "start",
      dragFree: true
    }, [
      Autoplay({ delay: 3000, stopOnInteraction: false }),
    ]);

    return () => embla && embla.destroy();
  }, []);

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1]
      },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  if (!related || related.length === 0) return null;

  return (
    <section
      ref={ref}
      className="relative px-4 md:px-8 lg:px-16 py-4  lg:max-w-[1400px] mx-auto overflow-hidden"
    >
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#254331]/5 to-transparent pointer-events-none" />
      
      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-[#254331]/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          animate={controls}
          className="text-center mb-2 lg:mb-2"
        >
          <motion.div
            className="inline-block mb-4"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-sm font-medium text-[#254331]/60 tracking-widest uppercase">
              Discover More
            </span>
          </motion.div>
          
          <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-[#debfad] mb-3">
            Related Products
          </h2>
          
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#debfad]/50" />
            <div className="w-2 h-2 rounded-full bg-[#debfad]/70" />
            <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#debfad]/50" />
          </div>
        </motion.div>

        {/* Mobile: Embla Carousel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="md:hidden"
        >
          <div className="overflow-hidden" ref={viewportRef}>
            <div className="flex gap-4 pb-4">
              {related.map((product) => (
                <motion.div
                  key={product.id}
                  className="flex-[0_0_85%] sm:flex-[0_0_70%]"
                  variants={itemVariants}
                >
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#254331]/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    <ProductCard
                      id={product.id}
                      images={product.images}
                      name={product.name}
                      category={product.category}
                      price={product.price}
                      variants={product.colors || []}
                      placement={product.placement}
                      stock={product.stock}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Swipe indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-2 mt-6 text-[#debfad]/50"
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: [-3, 3, -3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </motion.svg>
            <span className="text-sm">Swipe to explore</span>
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: [3, -3, 3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.div>
        </motion.div>

        {/* Desktop: Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {related.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="group relative">
                {/* Hover glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[#254331]/30 via-[#debfad]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                
                <div className="relative">
                  <ProductCard
                    id={product.id}
                    images={product.images}
                    name={product.name}
                    category={product.category}
                    price={product.price}
                    variants={product.colors || []}
                    placement={product.placement}
                    stock={product.stock}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom decorative element */}
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 bg-[#debfad]/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </section>
  );
};

export default RelatedProducts;