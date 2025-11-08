import BestSeller from "@/components/home/BestSeller";
import GetInspired from "@/components/home/GetInspired";
import NewArrivals from "@/components/home/NewArrivals";
import NewCollections from "@/components/home/NewCollections";
import YagsoTicker from "@/components/home/YagsoTicker";
import { Carousel } from "@/components/ui/carousel";
import React from "react";

const Home = () => {
  return (
    <>
      <GetInspired />

      <BestSeller />
      <YagsoTicker />
      <Carousel />
      {/* <YagsoTicker /> */}
      {/* <PopularCategory /> */}

      {/* <YagsoTicker /> */}

      <NewCollections />
      <YagsoTicker />
      <NewArrivals />

      {/* <TrendyCollection /> */}
    </>
  );
};
export default Home;
