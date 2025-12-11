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
  const isInView = useInView(ref, { once: true });

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

  // Fill with random products if less than 4

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
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  if (!related || related.length === 0) return null;

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
            <ProductCard
              id={product.id}
              images={product.images}
              name={product.name}
              category={product.category}
              price={product.price}
              variants={product.colors || []}
              placement={product.placement}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
