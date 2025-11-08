// src/components/layouts/Layout.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import NewsletterModal from "../modals/NewsletterModal";
import ContactModal from "../home/ContactModal";

const Layout = () => {
  const [showContact, setShowContact] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const hasSignup = localStorage.getItem("newsletterSignup");
    if (!hasSignup) setShowNewsletter(true);
  }, []);

  const handleNewsletterSubmit = (email) => {
    localStorage.setItem("newsletterSignup", email);
    setShowNewsletter(false);
  };

  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover opacity-[105%] z-[-1]"
      >
        <source src="/pinterestVideo.mp4" type="video/mp4" />
      </video>

      <div id="smooth-wrapper" className="lg:mx-[4rem]">
        <Header onOpenContact={() => setShowContact(true)} />
        <div className="relative z-10 bg-[#133827]/90 min-h-screen flex flex-col">
          <Outlet />
          <Footer />
        </div>
      </div>

      {/* Floating Contact Button */}
      <motion.button
        onClick={() => setShowContact(true)}
        className={`fixed right-2 top-[70%] -translate-y-1/2 z-[100] bg-[#debfad] text-primaryGreen rounded-full px-[1.5rem] h-14 flex items-center justify-center gap-2 shadow-lg transition-all
          ${showNewsletter ? "pointer-events-none opacity-40" : "hover:bg-[#b89e90]"}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        disabled={showNewsletter}
      >
        <p>Contact us</p>
        <Phone size={18} />
      </motion.button>

      <AnimatePresence>
        {showContact && <ContactModal setShowContact={setShowContact} />}
      </AnimatePresence>

      <AnimatePresence>
        {showNewsletter && (
          <NewsletterModal onSubmit={handleNewsletterSubmit} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Layout;
