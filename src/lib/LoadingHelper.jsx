import { BackgroundVideos } from "@/components/BackgroundVideos";
import PreparingAccessLoader from "@/components/PreparingAccessLoader";
import { Sparkles } from "@/components/Sparkles";
import { AnimatePresence } from "framer-motion";
import { useRef } from "react";

export const LoadingHelper = () => {
  const videoRefs = useRef([]);

  return (
    <div className="min-h-screen bg-stone-950 overflow-hidden relative">
      <BackgroundVideos currentImageIndex={0} videoRefs={videoRefs} />

      <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      <Sparkles />
      <AnimatePresence>
        <PreparingAccessLoader key="loader" />
      </AnimatePresence>
    </div>
  );
};
