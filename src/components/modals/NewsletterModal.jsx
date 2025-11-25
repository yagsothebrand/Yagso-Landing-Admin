"use client";

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, Mail, Check } from "lucide-react";
import { db } from "@/firebase";
import { useLandingAuth } from "../landingauth/LandingAuthProvider";
import {
  updateDoc,
  addDoc,
  getDoc,
  serverTimestamp,
  doc,
  collection,
} from "firebase/firestore";

const NewsletterModal = ({ onClose, initialEmail = "" }) => {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const { user } = useLandingAuth();
  console.log(
    "🚀 ~ file: NewsletterModal.jsx:18 ~ NewsletterModal ~ user:",
    user
  );
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = validEmail.test(email);

  const handleSubmit = async () => {
    if (!isValid || !user) return;

    setIsLoading(true);

    try {
      const userDocRef = doc(db, "users", user.id);

      // --- 1. Get the user doc ---
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        console.error("User not found in Firestore.");
        return;
      }

      const userData = userSnap.data();

      // --- 2. If newsletter does NOT exist, create it ---
      if (!userData.newsletter) {
        await updateDoc(userDocRef, {
          newsletter: {
            subscribed: true,
            subscribedAt: serverTimestamp(),
          },
        });
      } else {
        // If newsletter exists, update subscription
        await updateDoc(userDocRef, {
          "newsletter.subscribed": true,
          "newsletter.subscribedAt": serverTimestamp(),
        });
      }

      // --- 3. Create newsletter record in newsletters collection ---
      await addDoc(collection(db, "newsletters"), {
        userId: user.id,
        email: email,
        subscribed: true,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose?.();
      }, 2000);
    } catch (error) {
      console.error("🔥 Error saving newsletter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  // Close on ESC key
  useEffect(() => {
    const keyHandler = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [onClose]);

  // Close on click outside
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose?.();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "1rem",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes successPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .sparkle {
          position: absolute;
          animation: float 3s ease-in-out infinite;
        }
        .sparkle:nth-child(2) { animation-delay: 0.5s; }
        .sparkle:nth-child(3) { animation-delay: 1s; }
        .input-focus {
          transition: all 0.3s ease;
        }
        .input-focus:focus {
          transform: scale(1.02);
          box-shadow: 0 0 0 3px rgba(19, 56, 39, 0.1);
        }
      `}</style>

      <div
        ref={modalRef}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          borderRadius: "1.5rem",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          maxWidth: "28rem",
          width: "100%",
          position: "relative",
          animation: "slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Decorative Background Elements */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background: "linear-gradient(135deg, #edd7c8 0%, #d4a89f 100%)",
            borderRadius: "50%",
            opacity: 0.3,
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "150px",
            height: "150px",
            background: "linear-gradient(135deg, #133827 0%, #0d2b1d 100%)",
            borderRadius: "50%",
            opacity: 0.2,
            filter: "blur(40px)",
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            backgroundColor: isHovering
              ? "rgba(0, 0, 0, 0.15)"
              : "rgba(0, 0, 0, 0.08)",
            borderRadius: "50%",
            padding: "0.5rem",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            transform: isHovering ? "rotate(90deg)" : "rotate(0deg)",
            zIndex: 10,
          }}
        >
          <X size={18} color="#133827" />
        </button>

        {!submitted ? (
          <div
            style={{
              padding: "2.5rem 2rem",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Floating Sparkles */}
            <Sparkles
              className="sparkle"
              style={{ top: "20px", left: "30px", color: "#edd7c8" }}
              size={24}
            />
            <Sparkles
              className="sparkle"
              style={{ top: "40px", right: "40px", color: "#d4a89f" }}
              size={20}
            />
            <Sparkles
              className="sparkle"
              style={{
                bottom: "100px",
                left: "50px",
                color: "#133827",
                opacity: 0.6,
              }}
              size={18}
            />

            {/* Icon */}
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #133827 0%, #0d2b1d 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                boxShadow: "0 10px 25px rgba(19, 56, 39, 0.3)",
                animation: isHovering
                  ? "pulse 1s ease-in-out infinite"
                  : "none",
              }}
            >
              <Mail size={36} color="#edd7c8" />
            </div>

            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                color: "#133827",
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Stay in the Vibe ✨
            </h2>
            <p
              style={{
                color: "#6b7280",
                fontSize: "0.95rem",
                marginBottom: "2rem",
                lineHeight: "1.5",
              }}
            >
              Weekly inspo, exclusive drops & VIP perks delivered straight to
              your inbox
            </p>

            {/* Input */}
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <input
                type="email"
                value={email}
                onBlur={() => setTouched(true)}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && isValid && handleSubmit()
                }
                placeholder="Enter your email…"
                className="input-focus"
                style={{
                  width: "100%",
                  padding: "1rem 1rem 1rem 3rem",
                  fontSize: "0.95rem",
                  border: touched
                    ? isValid
                      ? "2px solid #0f5132"
                      : "2px solid #dc2626"
                    : "2px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  outline: "none",
                  backgroundColor: "#f9fafb",
                  color: "#133827",
                  transition: "all 0.3s ease",
                }}
              />
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
            </div>

            {touched && !isValid && email && (
              <p
                style={{
                  color: "#dc2626",
                  fontSize: "0.85rem",
                  marginTop: "0.5rem",
                  animation: "slideUp 0.3s ease-out",
                }}
              >
                Hmm… that email looks a bit sus 👀
              </p>
            )}

            <button
              disabled={!isValid || isLoading}
              onClick={handleSubmit}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.97)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              style={{
                marginTop: "1.5rem",
                background:
                  isValid && !isLoading
                    ? "linear-gradient(135deg, #133827 0%, #0d2b1d 100%)"
                    : "#d1d5db",
                color: "white",
                padding: "1rem 2rem",
                borderRadius: "0.75rem",
                fontSize: "0.95rem",
                fontWeight: "600",
                width: "100%",
                border: "none",
                cursor: isValid && !isLoading ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                boxShadow:
                  isValid && !isLoading
                    ? "0 4px 15px rgba(19, 56, 39, 0.3)"
                    : "none",
              }}
            >
              {isLoading ? "Saving..." : "Let's go 🚀"}
            </button>

            <p
              style={{
                marginTop: "1.5rem",
                fontSize: "0.75rem",
                color: "#9ca3af",
              }}
            >
              No spam, ever. Unsubscribe anytime. 💚
            </p>
          </div>
        ) : (
          <div
            style={{
              padding: "3rem 2rem",
              textAlign: "center",
              animation: "fadeIn 0.4s ease-out",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
                animation: "successPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <Check size={48} color="white" strokeWidth={3} />
            </div>

            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                color: "#133827",
                marginBottom: "0.5rem",
              }}
            >
              You're Official 🎉
            </h2>
            <p
              style={{
                color: "#6b7280",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              Your inbox is about to glow up 💌
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterModal;
