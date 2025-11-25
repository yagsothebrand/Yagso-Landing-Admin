import React, { useRef } from "react";
import Layout from "@/components/layouts/Layout";
import GetInspired from "@/components/home/GetInspired";
import YagsoTicker from "@/components/home/YagsoTicker";
import Carousel from "@/components/home/Carousel";
import BestSeller from "@/components/home/BestSeller";
import NewCollections from "@/components/home/NewCollections";
import GuidedTour from "@/components/home/GuidedTour";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";

const Home = () => {

  const carouselRef = useRef();
  const bestSellerRef = useRef();

  const refs = {
    carousel: carouselRef,
    bestSeller: bestSellerRef,
  };

  return (
    <Layout>
      <div>
        <GetInspired />
      </div>
      <div>
        <YagsoTicker />
      </div>
      <div ref={carouselRef}>
        <Carousel />
      </div>
      <div ref={bestSellerRef}>
        <BestSeller />
      </div>
      <div>
        <YagsoTicker />
      </div>
      <div>
        <NewCollections />
      </div>

      <GuidedTour refs={refs} />
    </Layout>
  );
};

export default Home;
