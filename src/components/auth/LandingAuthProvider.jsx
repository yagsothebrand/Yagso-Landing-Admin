import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  getDoc,
  updateDoc,
  increment,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const LandingAuthContext = createContext(null);

const COOKIE_TOKEN = "waitlist_token";
const COOKIE_ACCESS = "waitlist_access";

export const LandingAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // waitlist record
  const [token, setToken] = useState(() => Cookies.get(COOKIE_TOKEN) || null);
  const [accessGranted, setAccessGranted] = useState(
    () => Cookies.get(COOKIE_ACCESS) === "true",
  );
  const [loading, setLoading] = useState(true);

  // Fetch waitlist doc if access is granted
  useEffect(() => {
    const run = async () => {
      if (!token || !accessGranted) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const ref = doc(db, "waitlist", token);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          // invalid token → clear cookies
          Cookies.remove(COOKIE_TOKEN, { path: "/" });
          Cookies.remove(COOKIE_ACCESS, { path: "/" });

          setToken(null);
          setAccessGranted(false);
          setUser(null);
          setLoading(false);
          return;
        }

        setUser({ id: snap.id, ...snap.data() });

        // update stats in waitlist doc
        await updateDoc(ref, {
          lastLogin: serverTimestamp(),
          loginAttempt: increment(1),
        });
      } catch (e) {
        console.error("LandingAuthProvider error:", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token, accessGranted]);

  // Keep cookies synced (long-lived device access)
  useEffect(() => {
    if (token) {
      Cookies.set(COOKIE_TOKEN, token, {
        expires: 365, // ✅ “whole phone fr”
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    } else {
      Cookies.remove(COOKIE_TOKEN, { path: "/" });
    }

    Cookies.set(COOKIE_ACCESS, accessGranted ? "true" : "false", {
      expires: 365,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
  }, [token, accessGranted]);

  return (
    <LandingAuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        accessGranted,
        setAccessGranted,
        loading,
      }}
    >
      {children}
    </LandingAuthContext.Provider>
  );
};

export const useLandingAuth = () => {
  const ctx = useContext(LandingAuthContext);
  if (!ctx)
    throw new Error("useLandingAuth must be used within a LandingAuthProvider");
  return ctx;
};
