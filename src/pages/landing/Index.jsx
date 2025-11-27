"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";
import PreparingAccessLoader from "@/components/PreparingAccessLoader";
import Home from "./Home";
import { BackgroundVideos } from "@/components/BackgroundVideos";
import { Sparkles } from "@/components/Sparkles";
import { LoadingHelper } from "@/lib/LoadingHelper";

export default function Page() {
  const navigate = useNavigate();
  const { token, accessGranted, loading, userId, user } = useLandingAuth();


  // Only run after loading completes
  useEffect(() => {
    // ⛔ Wait until auth context fully loads
    if (loading) return;

    // ⛔ After loading finishes, *then* validate access
    if (!accessGranted || !token || !userId) {
      navigate("/waitlist", { replace: true });
      return;
    }
  }, [token, accessGranted, userId, loading, navigate]);

  if (loading) {
    return <LoadingHelper> </LoadingHelper>;
  }

  return <Home />;
}
