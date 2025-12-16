import PreparingAccessLoader from "@/components/PreparingAccessLoader";
import { Sparkles } from "@/components/Sparkles";
import { AnimatePresence } from "framer-motion";
import honey from "@/assets/lan.mp4";
import { BackgroundVideos } from "@/components/BackgroundVideos";
import { useRef } from "react";

export const LoadingHelper = () => {
  const videoRefs = useRef([]);
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Background Video */}
      <BackgroundVideos currentImageIndex={0} videoRefs={videoRefs} />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      <Sparkles />

      <AnimatePresence>
        <PreparingAccessLoader key="loader" />
      </AnimatePresence>
    </div>
  );
};
