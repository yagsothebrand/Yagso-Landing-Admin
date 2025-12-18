"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Check, Loader2 } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = validEmail.test(email);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const dividerVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.5,
      },
    },
  };

  const handleSubscribe = async () => {
    if (!isValid || isLoading) return;
    
    setIsLoading(true);

    try {
      // Simulate API call - replace with your actual Firebase logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
  
      await addDoc(collection(db, "newsletters"), {
        email,
        subscribed: true,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setEmail("");
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setTouched(false);
      }, 3000);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-[#debfad] text-[#133827] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <motion.img
              variants={logoVariants}
              className="w-32"
              src="/Yagso-logo.png"
              alt="YAGSO logo"
            />
            <motion.p
              variants={itemVariants}
              className="text-sm leading-relaxed"
            >
              Experience the art of fine jewelry — timeless designs crafted to
              express elegance, intention, and individuality.
            </motion.p>
          </motion.div>

          {/* Socials */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <h3 className="text-base font-semibold tracking-wide">
              Follow YAGSO
            </h3>
            <div className="flex gap-3">
              <motion.a
                href="https://www.instagram.com/yagsobyfifii/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="bg-[#133827] text-[#debfad] p-2 rounded-full transition-colors hover:bg-[#1b4e36]"
                aria-label="Follow us on Instagram"
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Instagram size={18} />
                </motion.div>
              </motion.a>
              <motion.a
                href="https://www.tiktok.com/@yagsobyfifii"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="bg-[#133827] text-[#debfad] p-2 rounded-full transition-colors hover:bg-[#1b4e36]"
                aria-label="Follow us on TikTok"
              >
                <motion.svg
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: -360 }}
                  transition={{ duration: 0.6 }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </motion.svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Legal & Contact Combined */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            {/* Legal */}
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-semibold tracking-wide">Legal</h3>
              <motion.a
                href="/return-refund"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="text-sm hover:underline transition-all"
              >
                Return & Refund Policy
              </motion.a>
              <motion.a
                href="/terms"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="text-sm hover:underline transition-all"
              >
                Terms of Service
              </motion.a>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-semibold tracking-wide">Contact</h3>
              <motion.a
                href="tel:09153480722"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="text-sm hover:underline transition-all"
              >
                0915 348 0722
              </motion.a>
              <motion.a
                href="mailto:support@yagso.com"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="text-sm hover:underline transition-all"
              >
                support@yagso.com
              </motion.a>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <h3 className="text-base font-semibold tracking-wide">
              Join Our Newsletter
            </h3>
            <p className="text-sm leading-relaxed">
              Exclusive drops, private sales, and fine jewelry insights.
            </p>

            {!submitted ? (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="Enter your email"
                    whileFocus={{ scale: 1.02 }}
                    className="w-full p-3 rounded-lg bg-white/70 text-sm focus:outline-none transition-all"
                    style={{
                      border: touched
                        ? isValid
                          ? "2px solid #0f5132"
                          : "2px solid #dc2626"
                        : "2px solid #133827",
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  />
                  {touched && !isValid && email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-600 mt-1"
                    >
                      Please enter a valid email
                    </motion.p>
                  )}
                </div>

                <motion.button
                  onClick={handleSubscribe}
                  disabled={!isValid || isLoading}
                  whileHover={isValid && !isLoading ? { scale: 1.05, y: -2 } : {}}
                  whileTap={isValid && !isLoading ? { scale: 0.95 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="py-3 rounded-lg text-sm font-medium transition-colors shadow-lg flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: isValid && !isLoading ? "#133827" : "#9ca3af",
                    color: "#debfad",
                    cursor: isValid && !isLoading ? "pointer" : "not-allowed",
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </motion.button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-100 border-2 border-green-600 rounded-lg p-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Check size={32} className="text-green-600 mx-auto mb-2" />
                </motion.div>
                <p className="text-sm font-semibold text-green-800">
                  You're subscribed! 🎉
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Check your inbox soon
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="mt-16 pt-6 text-center">
          <motion.div
            variants={dividerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="border-t border-[#133827]/40 mb-6 origin-left"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xs tracking-wide"
          >
            © {new Date().getFullYear()} YAGSO. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;