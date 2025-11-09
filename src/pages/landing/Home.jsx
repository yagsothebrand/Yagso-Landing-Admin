import BestSeller from "@/components/home/BestSeller";
import GetInspired from "@/components/home/GetInspired";
import NewArrivals from "@/components/home/NewArrivals";
import NewCollections from "@/components/home/NewCollections";
import YagsoTicker from "@/components/home/YagsoTicker";
import Layout from "@/components/layouts/Layout";
import { Carousel } from "@/components/ui/carousel";
import React from "react";

const Home = () => {
  return (
    <>
      <Layout>
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
      </Layout>
      {/* <TrendyCollection /> */}
    </>
  );
};
export default Home;
