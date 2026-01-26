import Footer from "../layout/Footer";
import ContactSection from "@/components/ContactSection";
import HeaderDesign from "@/layout/Header";
import HeroShopVisual from "./HeroShopVisual";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import { useProducts } from "@/components/auth/ProductsProvider";
import GetInspired from "@/components/GetInspired";
import Carousel from "@/components/Carousel";
import { useRef } from "react";

export default function Index() {
  const { products, loading } = useProducts();
  const carouselRef = useRef();
  const bestSellerRef = useRef();
  return (
    <main className="bg-white/20">
      <HeaderDesign />
      <GetInspired />
      {/* <HeroShopVisual /> */}
      <div ref={carouselRef}>
        <Carousel />
      </div>
      {/* Featured products */}
      {/* <section className="max-w-7xl mx-auto px-4 pb-10 bg-white/30">
        <FeaturedCarousel
          products={products || []}
          itemsPerView={3}
          mobileItemsPerView={2}
          autoPlay={!loading}
          autoPlayMs={4800}
        />
      </section> */}

      <ContactSection />
      <Footer />
    </main>
  );
}
