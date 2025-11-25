"use client";

import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  Gem,
  Star,
} from "lucide-react";
import { db } from "@/firebase";

function generatePasscode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function checkEmailExists(email) {
  try {
    const q = query(collection(db, "waitlist"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        exists: true,
        tokenId: doc.id,
        passcode: doc.data().passcode,
      };
    }
    return { exists: false };
  } catch (err) {
    console.error("Error checking email:", err);
    return { exists: false };
  }
}

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isExistingEmail, setIsExistingEmail] = useState(false);
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const heroRef = useRef(null);

  const videos = [
    { src: "/bowl.mp4", alt: "Jeweled chess piece" },
    { src: "/media.mp4", alt: "Statement rings on hands" },
    { src: "/hand.mp4", alt: "Luxury lifestyle flatlay" },
    { src: "/card.mp4", alt: "Jeweled chess piece" },
  ];

  const sparkles = Array.from({ length: 30 }, (_, i) => i);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % videos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [videos.length]);

  useEffect(() => {
    videoRefs.current.forEach((img, index) => {
      if (img) {
        if (index === currentImageIndex) {
          gsap.to(img, {
            opacity: 1,
            scale: 1.05,
            duration: 2,
            ease: "power2.inOut",
          });
        } else {
          gsap.to(img, {
            opacity: 0,
            scale: 1,
            duration: 2,
            ease: "power2.inOut",
          });
        }
      }
    });
  }, [currentImageIndex]);

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

  useEffect(() => {
    if (showForm) {
      gsap.to(videoRefs.current, {
        scale: 1.15,
        opacity: 0.15,
        filter: "blur(8px)",
        duration: 1.2,
        ease: "power3.inOut",
      });
      gsap.to(heroRef.current, {
        scale: 0.92,
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
    } else {
      gsap.to(videoRefs.current, {
        scale: 1.05,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.inOut",
      });
      gsap.to(heroRef.current, {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      });
    }
  }, [showForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      // 1. Validate email format BEFORE anything
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Invalid email address. Please enter a valid email.");
        setLoading(false);
        return;
      }

      // 2. Check if email exists in waitlist already
      let existingEmail;
      try {
        existingEmail = await checkEmailExists(email);
      } catch (err) {
        throw new Error("Failed to check email. Please try again.");
      }

      let tokenId = existingEmail.tokenId;
      let passcode = existingEmail.passcode || ""; // Get existing passcode if it exists

      // 3. For NEW emails: create Firestore doc FIRST to get a valid tokenId
      if (!existingEmail.exists) {
        passcode = generatePasscode();
        const docRef = await addDoc(collection(db, "waitlist"), {
          email,
          passcode,
          createdAt: serverTimestamp(),
          loginAttempt: 0,
          lastLogin: serverTimestamp(),
        });
        tokenId = docRef.id; // Now we have a real ID
      }

      // 4. Generate magic link with valid tokenId
      const magicLink = `${window.location.origin}/auth/login?token=${tokenId}`;

      // 5. Send the email with valid token
      const emailRes = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passcode, magicLink, tokenId }),
      });

      if (!emailRes.ok) {
        const errData = await emailRes.json();
        throw new Error(errData.error || "Failed to send email.");
      }

      // 6. Success! Set UI state
      setIsExistingEmail(false);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  console.log(success, isExistingEmail);
  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-stone-950 overflow-hidden relative"
    >
      <div className="fixed inset-0">
        {videos.map((video, index) => (
          <div
            key={index}
            ref={(el) => (videoRefs.current[index] = el)}
            className="absolute inset-0 opacity-0 transition-opacity duration-1000"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={video.src} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
      {success ? (
        <div className="min-h-screen  relative overflow-hidden">
          {sparkles.map((i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                opacity: 0,
                scale: 0,
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1200),
                y:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 800),
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3,
              }}
            >
              <Star className="w-3 h-3 text-green-800" />
            </motion.div>
          ))}

          <div className="min-h-screen flex items-center justify-center p-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "backOut" }}
              className="text-center max-w-2xl"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: "backOut" }}
                className="w-32 h-32 mx-auto mb-12 neon-text bg-gradient-to-br from-green-800 to-green-900 rounded-full flex items-center justify-center shadow-2xl"
              >
                <CheckCircle className="w-16 h-16 text-white" />
              </motion.div>

              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-5xl md:text-6xl font-light bg-gradient-to-r from-green-800 to-green-900 bg-clip-text text-transparent mb-8"
              >
                {isExistingEmail ? "Welcome Back" : "Welcome to Yagso"}
              </motion.h1>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-lg neon-text text-green-800 mb-12 leading-relaxed"
              >
                {isExistingEmail ? (
                  <>
                    We've resent your exclusive access link.
                    <br />
                    <span className="text-base text-green-700">
                      Check your email for your login link and access code.
                    </span>
                    <br />
                    <span className="text-sm text-green-600">
                      Your access code remains the same.
                    </span>
                  </>
                ) : (
                  <>
                    Your exclusive passcode has been sent.
                    <br />
                    <span className="text-base text-green-700">
                      Check your email for the login link and access code.
                    </span>
                    <br />
                    Prepare to discover extraordinary luxury.
                  </>
                )}
              </motion.p>

              <motion.button
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                  setShowForm(false);
                  setIsExistingEmail(false);
                  setError("");
                }}
                className="px-10 py-4 bg-gradient-to-r from-green-700 to-green-900 text-white text-md font-light rounded-full hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                Join With Another Email
              </motion.button>
            </motion.div>
          </div>
        </div>
      ) : (
        <>
          <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

          {sparkles.slice(0, 15).map((i) => (
            <motion.div
              key={i}
              className="absolute opacity-10 z-5"
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1200),
                y:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 800),
              }}
              animate={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1200),
                y:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 800),
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "linear",
              }}
            >
              <Gem className="w-6 h-6 text-green-800" />
            </motion.div>
          ))}
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
            <motion.div
              ref={heroRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                className="flex items-center justify-center mb-72"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <img
                  src="/logo.png"
                  alt="Yagso"
                  width={1000}
                  height={550}
                  className="w-auto h-40 md:h-70 drop-shadow-2xl"
                  priority
                />
              </motion.div>

              <AnimatePresence mode="wait">
                {!showForm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.p
                      className="text-4xl md:text-5xl text-stone-100 font-light mb-6 leading-relaxed max-w-3xl mx-auto tracking-wide"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      Discover the art of timeless luxury.
                    </motion.p>
                    <motion.p
                      className="text-xl md:text-2xl text-stone-300 font-light mb-16 leading-relaxed max-w-2xl mx-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.7 }}
                    >
                      {" "}
                    </motion.p>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.9 }}
                      onClick={() => {
                        setShowForm(true);
                        setError("");
                      }}
                      className="px-5 py-5 bg-green-50 hover:bg-white text-green-900 text-base rounded-full shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-white/20 font-light tracking-wider inline-flex items-center space-x-3"
                    >
                      <span>Request Exclusive Access</span>
                      <Gem className="w-5 h-5 text-green-800" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm"
                >
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => setShowForm(false)}
                    className="absolute top-8 right-8 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-2xl font-light transition-all duration-300"
                  >
                    ×
                  </motion.button>

                  <div className="max-w-lg w-full mx-auto px-8">
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="text-center mb-12"
                    >
                      <h2 className="text-4xl md:text-5xl font-light text-green-700 mb-6">
                        Join Our Elite Circle
                      </h2>
                      <p className="neon-text text-lg leading-relaxed text-green-800 text-center max-w-xl mx-auto">
                        Enter your email to receive your exclusive access code
                        and be notified of our most precious releases.
                      </p>
                    </motion.div>

                    <motion.form
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      onSubmit={handleSubmit}
                      className="space-y-8"
                    >
                      <div className="relative">
                        <motion.div
                          animate={
                            focusedInput ? { scale: 1.02 } : { scale: 1 }
                          }
                          transition={{ duration: 0.3 }}
                          className="relative"
                        >
                          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <Mail
                              className={`w-6 h-6 transition-colors duration-300 ${
                                focusedInput
                                  ? "text-green-700"
                                  : "text-stone-400"
                              }`}
                            />
                          </div>

                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedInput(true)}
                            onBlur={() => setFocusedInput(false)}
                            className="w-full pl-16 pr-6 py-5 bg-white/10 border-2 border-stone-700/30 rounded-full focus:border-green-700 focus:bg-white/20 focus:outline-none transition-all duration-300 text-green-500 placeholder-stone-500 text-lg backdrop-blur-sm"
                            required
                          />

                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: focusedInput ? "100%" : "0%" }}
                            className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-green-800 to-green-900 rounded-full"
                          />
                        </motion.div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={loading || !email}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="w-full py-5 bg-gradient-to-r from-green-700 to-green-900 text-white font-semibold rounded-full shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-green-700/50 text-lg relative overflow-hidden"
                      >
                        <AnimatePresence mode="wait">
                          {loading ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-center space-x-3"
                            >
                              <Loader2 className="w-6 h-6 animate-spin" />
                              <span>Securing Your Access...</span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="submit"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-center space-x-3"
                            >
                              <span>Reserve My Exclusive Access</span>
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                }}
                              >
                                →
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>

                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center justify-center space-x-2 text-red-300 bg-red-900/30 p-4 rounded-2xl backdrop-blur-sm"
                          >
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.form>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="text-center  neon-text mt-8 text-green-400 text-sm"
                    >
                      <p>
                        By joining, you agree to receive exclusive updates about
                        our luxury collections.
                        <br />
                        Your privacy is as precious as our jewelry.
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

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
