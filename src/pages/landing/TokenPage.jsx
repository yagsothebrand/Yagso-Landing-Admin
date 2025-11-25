"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

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
  const { setToken, setAccessGranted } = useLandingAuth();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  const videoRefs = useRef([]);

  // 👉 Load waitlist info using token
  useEffect(() => {
    if (!token) return;

    // ✅ Immediately save to context & localStorage
    setToken(token);
    setAccessGranted(false); // passcode not verified yet
    localStorage.setItem("token", token);
    localStorage.setItem("accessGranted", "false");

    async function loadData() {
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
        setShowPasscode(true); // show passcode verification
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token, setToken, setAccessGranted]);

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

      // ✅ Update context and localStorage
      setToken(waitlistDocId); // Keep original waitlist token // Store actual user ID
      setAccessGranted(true);

      localStorage.setItem("token", waitlistDocId);
    localStorage.setItem("userId", finalUserId);
      localStorage.setItem("accessGranted", "true");

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
            error={error}
            onResend={async () => {
              const magicLink = `https://yagso.com/${token}`;
              await sendWaitlistEmail(email, passcode, magicLink, token);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
