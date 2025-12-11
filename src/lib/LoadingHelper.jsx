import PreparingAccessLoader from "@/components/PreparingAccessLoader";
import { Sparkles } from "@/components/Sparkles";
import { AnimatePresence } from "framer-motion";
import honey from "@/assets/lan.mp4";

export const LoadingHelper = () => {
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={honey}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      <Sparkles />

      <AnimatePresence>
        <PreparingAccessLoader key="loader" />
      </AnimatePresence>
    </div>
  );
};
