import { createContext, useContext, useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";

const LandingAuthContext = createContext(null);

export const LandingAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Fetch user whenever token changes
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const docRef = doc(db, "waitlist", token);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = { id: docSnap.id, ...docSnap.data() };
          setUser(userData);

          await updateDoc(docRef, {
            lastLogin: serverTimestamp(),
            loginAttempt: increment(1),
          });
        } else {
          console.warn("⚠️ Invalid token — removing it");
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error("🔥 Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Keep localStorage synced
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <LandingAuthContext.Provider
      value={{ user, setUser, token, setToken, loading }}
    >
      {children}
    </LandingAuthContext.Provider>
  );
};

export const useLandingAuth = () => {
  const context = useContext(LandingAuthContext);
  if (!context) {
    throw new Error("useLandingAuth must be used within a LandingAuthProvider");
  }
  return context;
};
