"use client";

import { useState, useEffect, useRef } from "react";
import EmblaCarousel from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../cards/ProductCard";

import { useProducts } from "../products/ProductsProvider";
import { useCart } from "../cart/CartProvider";
import { useLandingAuth } from "../landingauth/LandingAuthProvider";
import ShopAllView, { SectionTitle } from "./ShopAllView";

const BestSeller = () => {
  const viewportRef = useRef(null);
  const emblaRef = useRef(null);
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { token } = useLandingAuth();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [showShopAll, setShowShopAll] = useState(false);

  useEffect(() => {
    if (!viewportRef.current) return;

    const embla = EmblaCarousel(
      viewportRef.current,
      {
        loop: true,
        align: "start",
        slidesToScroll: 1,
      },
      [Autoplay({ delay: 2500, stopOnInteraction: false })]
    );

    emblaRef.current = embla;

    const updateButtons = () => {
      setCanScrollPrev(embla.canScrollPrev());
      setCanScrollNext(embla.canScrollNext());
    };

    embla.on("select", updateButtons);
    updateButtons();

    return () => embla.destroy();
  }, []);

  const scrollPrev = () => emblaRef.current?.scrollPrev();
  const scrollNext = () => emblaRef.current?.scrollNext();

  return (
    <>
      <div
        id="shop-section"
        className="relative px-4 md:px-[1rem] py-[2rem] md:py-[3rem] min-h-[60vh] flex flex-col items-center justify-center w-full lg:max-w-[1200px] mx-auto"
      >
        <div className="w-full">
          <SectionTitle
            title="Our Best Sellers"
            see={true}
            onSeeAll={() => setShowShopAll(true)}
          />
        </div>

        <div className="pt-[2rem] md:pt-[3rem] bg-transparent w-full overflow-hidden relative">
          <div className="overflow-hidden" ref={viewportRef}>
            <div className="flex bg-transparent">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="
                    flex-[0_0_85%] 
                    sm:flex-[0_0_50%] 
                    md:flex-[0_0_33.333%] 
                    lg:flex-[0_0_25%] 
                    p-2 sm:p-3 
                    bg-transparent
                  "
                >
                  <ProductCard
                    id={prod.id}
                    name={prod.name}
                    category={prod.category}
                    price={prod.price}
                    images={prod.images}
                    variants={prod.variants}
                    placement={prod.placement}
                    stock={prod.stock}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute text-[#debfad] left-0 top-1/2 -translate-y-1/2 z-10 bg-[#133827]/80 hover:bg-[#133827] rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute text-[#debfad] right-0 top-1/2 -translate-y-1/2 z-10 bg-[#133827]/80 hover:bg-[#133827] rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Shop All Modal */}
      {showShopAll && (
        <ShopAllView
          products={products}
          onClose={() => setShowShopAll(false)}
        />
      )}
    </>
  );
};

export default BestSeller;
