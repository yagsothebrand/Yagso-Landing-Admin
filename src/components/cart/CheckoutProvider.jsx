// src/context/CheckoutProvider.js
import React, { createContext, useContext, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useLandingAuth } from "../landingauth/LandingAuthProvider";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { user, userId } = useLandingAuth();

  const generateCheckoutId = () => {
    return "chk_" + Math.random().toString(36).substring(2, 12);
  };

  const getCheckoutId = async () => {
    setLoading(true);

    const userRef = doc(db, "users", userId);
    try {
      // 1. Re-fetch the latest user document (prevents stale context data)
      const freshSnap = await getDoc(userRef);

      if (!freshSnap.exists()) {
        throw new Error("User does not exist in Firestore.");
      }

      const freshData = freshSnap.data();

      // 2. If checkoutId already exists → use it
      if (freshData.checkoutId) {
        return freshData.checkoutId;
      }

      // 3. Otherwise generate a new ID
      const newCheckoutId = generateCheckoutId();

      await setDoc(userRef, { checkoutId: newCheckoutId }, { merge: true });

      return newCheckoutId;
    } catch (err) {
      console.error("getCheckoutId ERROR:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CheckoutContext.Provider value={{ getCheckoutId, loading }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
