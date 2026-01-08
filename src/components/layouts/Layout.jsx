// src/components/layouts/Layout.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import NewsletterModal from "../modals/NewsletterModal";
import ContactModal from "../home/ContactModal";
import { useLandingAuth } from "../landingauth/LandingAuthProvider";

const Layout = ({ children, contactBtnRef }) => {
  const [showContact, setShowContact] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const location = useLocation();
  const { user, loading } = useLandingAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    if (!loading && user) {
      const isSubscribed = user.newsletter?.subscribed === true;

      if (!isSubscribed) {
        setShowNewsletter(true);
      } else {
        setShowNewsletter(false);
      }
    }
  }, [user, loading]);

  return (
    <>
      {/* Background Video - Mobile & Desktop Optimized */}
      <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     min-w-full min-h-full w-auto h-auto object-cover 
                     opacity-[105%] scale-100 md:scale-100"
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        >
          <source src="/pinterestVideo.mp4" type="video/mp4" />
        </video>
      </div>

      <div id="smooth-wrapper" className="lg:mx-[4rem]">
        <Header onOpenContact={() => setShowContact(true)} />

        <div className="relative z-10 bg-[#ffffff]/70 min-h-screen flex flex-col">
          {!loading ? children : null}
          {!loading ? <Footer /> : null}
        </div>
      </div>

      {/* Fixed Contact Button - Mobile Optimized */}
      <motion.button
        ref={contactBtnRef}
        onClick={() => setShowContact(true)}
        className="fixed 
                   right-3 bottom-6 
                   md:right-4 md:top-[50%] md:-translate-y-1/2 md:bottom-auto
                   z-[200] 
                   bg-[#ffffff] text-[#0e4132] 
                   rounded-full 
                   px-4 py-3 h-12
                   md:px-6 md:h-14 
                   flex items-center justify-center gap-2 
                   shadow-lg transition-all hover:bg-[#b89e90]/60
                   text-sm md:text-base font-medium
                   whitespace-nowrap"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="hidden sm:inline">Contact us</span>
        <span className="sm:hidden"></span>
        <Phone size={18} className="flex-shrink-0" />
      </motion.button>

      <AnimatePresence>
        {showContact && <ContactModal setShowContact={setShowContact} />}
      </AnimatePresence>

      <AnimatePresence>
        {showNewsletter && (
          <NewsletterModal
            initialEmail={user?.email || ""}
            onClose={() => setShowNewsletter(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Layout;