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

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { setToken, setAccessGranted } = useLandingAuth();
  const [showForm, setShowForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState("");

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
        // Existing user → login flow
        setToken(existing.tokenId);
        setAccessGranted(true);
        navigate(`/${existing.tokenId}`, { replace: true });
        return;
      }

      // New user → create waitlist entry
      const { tokenId, passcode } = await addToWaitlist(email);
      const magicLink = `https://yagso.com/${tokenId}`;

      await sendWaitlistEmail(email, passcode, magicLink, tokenId);

      setSuccess(true);
      setShowForm(false);
    } catch (err) {
      setError(
        err?.response?.data?.error || err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setShowForm(false);
    setError("");
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-stone-950 overflow-hidden relative"
    >
      <BackgroundVideos
        currentImageIndex={currentImageIndex}
        showForm={showForm}
        videoRefs={videoRefs}
      />

      <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      <Sparkles />

      <HeroSection
        showForm={showForm}
        onShowForm={() => setShowForm(true)}
        heroRef={heroRef}
      />

      {success ? (
        <SuccessScreen onReset={handleReset} isExistingEmail={false} />
      ) : null}

      <AnimatePresence>
        {showForm && (
          <EmailForm
            onSubmit={handleEmailSubmit}
            loading={loading}
            error={error}
            onClose={() => setShowForm(false)}
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
    </div>
  );
}
