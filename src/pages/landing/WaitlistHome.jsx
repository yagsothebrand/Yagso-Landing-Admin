"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { BackgroundVideos } from "@/components/BackgroundVideos";
import { HeroSection } from "@/components/WaitlistHero";
import { EmailForm } from "@/components/EmailForm";
import { SuccessScreen } from "@/components/SuccessScreen";
import { Sparkles } from "@/components/Sparkles";

import {
  checkEmailExists,
  addToWaitlist,
  sendWaitlistEmail,
} from "@/utils/waitlistUtils";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";
import { useNavigate } from "react-router-dom";

// Screen states
const SCREEN_STATE = {
  HOME: "home",
  FORM: "form",
  SUCCESS: "success",
};

export default function HomePage() {
  const [screenState, setScreenState] = useState(SCREEN_STATE.HOME);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setToken, setAccessGranted } = useLandingAuth();

  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const heroRef = useRef(null);

  // Background video rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // GSAP parallax tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const moveX = (clientX - centerX) / 80;
      const moveY = (clientY - centerY) / 80;

      videoRefs.current.forEach((img) => {
        if (img) {
          gsap.to(img, {
            x: moveX,
            y: moveY,
            duration: 2,
            ease: "power2.out",
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // → When an email is submitted
  const handleEmailSubmit = async (email) => {
    setLoading(true);
    setError("");

    try {
      const existing = await checkEmailExists(email);

      // Existing email → login flow
      if (existing.exists && existing.tokenId) {
        setToken(existing.tokenId);
        setAccessGranted(true);
        navigate(`/${existing.tokenId}`, { replace: true });
        return;
      }

      // New user → create waitlist entry
      const { tokenId, passcode } = await addToWaitlist(email);
      const magicLink = `https://yagso.com/${tokenId}`;

      const response = await sendWaitlistEmail(
        email,
        passcode,
        magicLink,
        tokenId
      );
      console.log(response.data);
      console.log("Waitlist email sent successfully.", response.success);
      if (response.data.success === "true") {
        console.log("Waitlist email sent successfully.");
        // Transition to success screen
        setScreenState(SCREEN_STATE.SUCCESS);
        console.log("Success screen shown", SCREEN_STATE.SUCCESS, screenState);
        return;
      }
    } catch (err) {
      setError(
        err?.response?.data?.error || err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScreenState(SCREEN_STATE.HOME);
    setError("");
  };

  const handleOpenForm = () => {
    setScreenState(SCREEN_STATE.FORM);
  };

  const handleCloseForm = () => {
    setScreenState(SCREEN_STATE.HOME);
    setError("");
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-stone-950 overflow-hidden relative"
    >
      {/* HOME & FORM screens - show background */}
      {screenState !== SCREEN_STATE.SUCCESS && (
        <>
          <BackgroundVideos
            currentImageIndex={currentImageIndex}
            showForm={screenState === SCREEN_STATE.FORM}
            videoRefs={videoRefs}
          />

          <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

          <Sparkles />

          <HeroSection
            showForm={screenState === SCREEN_STATE.FORM}
            onShowForm={handleOpenForm}
            heroRef={heroRef}
          />

          <AnimatePresence>
            {screenState === SCREEN_STATE.FORM && (
              <EmailForm
                onSubmit={handleEmailSubmit}
                loading={loading}
                error={error}
                onClose={handleCloseForm}
              />
            )}
          </AnimatePresence>

          <footer className="relative z-10 py-8 px-6">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-stone-500 text-sm font-light">
                © 2025 Yagso. Timeless luxury.
              </p>
            </div>
          </footer>
        </>
      )}

      {/* SUCCESS screen - full overlay */}
      <AnimatePresence>
        {screenState === SCREEN_STATE.SUCCESS && (
          <SuccessScreen onReset={handleReset} isExistingEmail={false} />
        )}
      </AnimatePresence>
    </div>
  );
}
