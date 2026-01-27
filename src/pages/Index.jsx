import Footer from "../layout/Footer";
import ContactSection from "@/components/ContactSection";
import HeaderDesign from "@/layout/Header";
import HeroShopVisual from "./HeroShopVisual";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import { useProducts } from "@/components/auth/ProductsProvider";
import GetInspired from "@/components/GetInspired";
import Carousel from "@/components/Carousel";
import { useRef } from "react";
import ShopWithVideo from "@/components/ShopWithVideo";
import BlogSection from "@/components/BlogSection";

export default function Index() {
  const { products, loading } = useProducts();
  const carouselRef = useRef();
  const bestSellerRef = useRef();
  return (
    <>
 
      <main className="  md:pt-24 pt-20">
             <HeaderDesign />
        <GetInspired />
        {/* <ShopWithVideo /> */}

        <ShopWithVideo products={products || []} />
        <FeaturedCarousel />
   
        <BlogSection />
             <Carousel />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
