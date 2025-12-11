// src/context/CheckoutProvider.js
import React, { createContext, useContext, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useLandingAuth } from "../landingauth/LandingAuthProvider";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useLandingAuth();

  const generateCheckoutId = () => {
    return "chk_" + Math.random().toString(36).substring(2, 12);
  };

  const getCheckoutId = async () => {
    setLoading(true);

    let checkoutId;

    if (user.checkoutId) {
      // Found existing checkoutId
      setLoading(false);
      return user.checkoutId;
    }

    // Generate new checkout ID
    checkoutId = generateCheckoutId();

    await setDoc(
      userRef,
      { checkoutId },
      { merge: true } // don’t overwrite other user fields
    );

    setLoading(false);
    return checkoutId;
  };

  return (
    <CheckoutContext.Provider value={{ getCheckoutId, loading }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
