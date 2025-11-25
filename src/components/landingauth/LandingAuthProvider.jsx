import { createContext, useContext, useState, useEffect } from "react";
import {
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db, doc } from "@/firebase";

const LandingAuthContext = createContext(null);

export const LandingAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [accessGranted, setAccessGranted] = useState(
    localStorage.getItem("accessGranted") === "true"
  );

  const [loading, setLoading] = useState(true);

  // Fetch user whenever token changes AND access is granted
  useEffect(() => {
    const fetchUser = async () => {
      if (!token || !accessGranted) {
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
          console.log("✅ User fetched:", userData);
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
          setAccessGranted(false);
        }
      } catch (error) {
        console.error("🔥 Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, accessGranted]);

  // Keep localStorage synced

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    console.log(user);
    // Save userId if user exists, otherwise remove it
    if (user?.userId) {
      localStorage.setItem("userId", user.userId);
    } else {
      localStorage.removeItem("userId");
    }

    localStorage.setItem("accessGranted", accessGranted ? "true" : "false");
  }, [token, accessGranted, user]);

  console.log(user);
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
  const context = useContext(LandingAuthContext);
  if (!context) {
    throw new Error("useLandingAuth must be used within a LandingAuthProvider");
  }
  return context;
};
