"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Cookies from 'js-cookie';

import { BackgroundVideos } from "@/components/BackgroundVideos";
import { PasscodeVerification } from "@/components/PasscodeVerification";
import { Sparkles } from "@/components/Sparkles";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";

import {
  sendWaitlistEmail,
  createUserDocument,
  updateWaitlistWithUserId,
} from "@/utils/waitlistUtils";

import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";

export default function TokenPage() {
  const { token } = useParams(); // 🔥 this is the waitlist docId
  const navigate = useNavigate();
  const { setToken, setAccessGranted, setUserId } = useLandingAuth();
  console.log("TokenPage token:", token);
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  const videoRefs = useRef([]);

  // 👉 Load waitlist info using token
  useEffect(() => {
    if (!token) return;

    setToken(token);
    setAccessGranted(false); // Passcode not verified yet
    
    // Save to cookies
    Cookies.set("token", token, { 
      expires: 7, 
      secure: true, 
      sameSite: 'strict' 
    });
    Cookies.set("accessGranted", "false", { 
      expires: 7, 
      sameSite: 'strict' 
    });

    async function loadData() {
      console.log("Waitlist data loaded:");
      try {
        const docRef = doc(db, "waitlist", token);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError("Invalid or expired access link.");
          setLoading(false);
          return;
        }

        const data = docSnap.data();
        setEmail(data.email);
        setPasscode(data.passcode);
        console.log("Waitlist data loaded:", data);
        setShowPasscode(true); // Show passcode verification
      } catch (err) {
        console.error("Error loading waitlist data:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]); // Add token as a dependency

  // 👉 Handle passcode verification
  const handlePasscodeVerify = async (passcode) => {
    setLoading(true);
    setError("");

    try {
      // Find matching waitlist doc
      const q = query(collection(db, "waitlist"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Email not found.");
        return;
      }

      const waitlistDoc = querySnapshot.docs[0];
      const waitlistDocId = waitlistDoc.id;
      const waitlistData = waitlistDoc.data();
      const storedPasscode = waitlistData.passcode;

      // ❌ Wrong passcode
      if (passcode !== storedPasscode) {
        setError("Invalid passcode. Please try again.");
        return;
      }
      // ✅ After verifying passcode
      let finalUserId;

      // CASE 1: Waitlist already linked
      if (waitlistData.userId) {
        finalUserId = waitlistData.userId;
      } else {
        // CASE 2: Create new user
        finalUserId = await createUserDocument(
          email,
          waitlistDocId,
          storedPasscode,
          waitlistDoc
        );

        // Link waitlist → user
        await updateWaitlistWithUserId(waitlistDocId, finalUserId);
      }

      // ✅ Update context and cookies
      setToken(waitlistDocId); // Keep original waitlist token
      setAccessGranted(true);
      setUserId(finalUserId); // Store actual user ID
      
      // Save to cookies with security options
      Cookies.set("token", waitlistDocId, { 
        expires: 7, 
        secure: true, 
        sameSite: 'strict' 
      });
      Cookies.set("userId", finalUserId, { 
        expires: 7, 
        secure: true, 
        sameSite: 'strict' 
      });
      Cookies.set("accessGranted", "true", { 
        expires: 7, 
        sameSite: 'strict' 
      });

      // ✅ Redirect
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 overflow-hidden relative">
      <BackgroundVideos
        currentImageIndex={0}
        showForm={showPasscode}
        videoRefs={videoRefs}
      />

      <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      <Sparkles />

      <AnimatePresence>
        {showPasscode && (
          <PasscodeVerification
            email={email}
            onVerify={handlePasscodeVerify}
            loading={loading}
            resendLoading={resendLoading}
            error={error}
            onResend={async () => {
              try {
                const magicLink = `https://yagso.com/${token}`;
                setResendLoading(true);
                setError("");
                await sendWaitlistEmail(email, passcode, magicLink, token);
                setTimeout(() => setResendLoading(false), 2000);
              } catch (err) {
                setResendLoading(false);
                setError(err.message || "Something went wrong sending email");
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}