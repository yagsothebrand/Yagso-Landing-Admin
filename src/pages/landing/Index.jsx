"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";
import PreparingAccessLoader from "@/components/PreparingAccessLoader";
import Home from "./Home";
import { BackgroundVideos } from "@/components/BackgroundVideos";
import { Sparkles } from "@/components/Sparkles";

export default function Page() {
  const navigate = useNavigate();
  const { token, accessGranted, loading, userId, user } = useLandingAuth();
  const videoRefs = useRef([]);
  const [showLoader, setShowLoader] = useState(true);
  console.log(token, accessGranted, userId, user);
  // Only run after loading completes
  useEffect(() => {
    // ⛔ Wait until auth context fully loads
    if (loading) return;

    // ⛔ After loading finishes, *then* validate access
    if (!accessGranted || !token || !userId) {
      navigate("/waitlist", { replace: true });
      return;
    }

    // ⭕ Valid session — hide loader
    setTimeout(() => setShowLoader(false), 800);
  }, [token, accessGranted, userId, loading, navigate]);

  if (loading || showLoader) {
    return (
      <div className="min-h-screen bg-stone-950 overflow-hidden relative">
        <BackgroundVideos
          currentImageIndex={0}
          showForm={true}
          videoRefs={videoRefs}
        />

        <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

        <Sparkles />

        <AnimatePresence>
          <PreparingAccessLoader key="loader" />
        </AnimatePresence>
      </div>
    );
  }

  return <Home />;
}
