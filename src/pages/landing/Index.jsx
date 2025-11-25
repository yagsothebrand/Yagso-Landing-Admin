"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";
import PreparingAccessLoader from "@/components/PreparingAccessLoader";
import Home from "./Home";
import { BackgroundVideos } from "@/components/BackgroundVideos";
import { Sparkles } from "@/components/Sparkles";
import { useSearchParams } from "react-router-dom";

export default function Page() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, accessGranted, loading, user } = useLandingAuth();
  const videoRefs = useRef([]);
  const [showLoader, setShowLoader] = useState(true);
  const urlToken = searchParams.get("token");

  useEffect(() => {
    if (loading) return;

    // Check URL token first, then context
    const validToken = urlToken || token;

    if (!validToken && !user) {
      navigate("/waitlist", { replace: true });
    } else {
      setTimeout(() => setShowLoader(false), 800);
    }
  }, [urlToken, token, user, loading, navigate]);

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
