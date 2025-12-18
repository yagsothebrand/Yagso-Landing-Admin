import { createContext, useContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import {
  getDoc,
  getDocs,
  updateDoc,
  increment,
  doc,
  collection,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";

const LandingAuthContext = createContext(null);

export const LandingAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => Cookies.get("token") || null);
  const [userId, setUserId] = useState(() => Cookies.get("userId") || null);
  const [accessGranted, setAccessGranted] = useState(
    Cookies.get("accessGranted") === "true"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!accessGranted || !token) {
        setUser(null);
        setUserId(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // 1️⃣ Fetch the waitlist entry using token
        const waitlistRef = doc(db, "waitlist", token);
        const waitlistSnap = await getDoc(waitlistRef);

        if (!waitlistSnap.exists()) {
          console.warn("⚠️ Token does not match any waitlist entry");
          Cookies.remove("token");
          setToken(null);
          setUser(null);
          setUserId(null);
          setAccessGranted(false);
          setLoading(false);
          return;
        }

        const waitlistData = waitlistSnap.data();
        const waitlistId = waitlistSnap.id;

        console.log("✅ Waitlist entry found:", waitlistData);

        // 2️⃣ Fetch the actual user doc from `users` collection
        const usersCol = collection(db, "users");
        const q = query(usersCol, where("waitlistId", "==", waitlistId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.warn("⚠️ No user doc found for waitlistId:", waitlistId);
          setUser(null);
          setUserId(null);
          setLoading(false);
          return;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = { id: userDoc.id, ...userDoc.data() };

        console.log("✅ Full user profile fetched:", userData);

        setUser(userData);
        setUserId(userData.id);

        // 3️⃣ Update login info
        await updateDoc(doc(db, "users", userData.id), {
          lastLogin: serverTimestamp(),
          loginAttempt: increment(1),
        });
      } catch (error) {
        console.error("🔥 Error fetching user:", error);
        setUser(null);
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, accessGranted]);

  // Keep cookies in sync
  useEffect(() => {
    if (token) {
      Cookies.set("token", token, { 
        expires: 7, 
        secure: true, 
        sameSite: 'strict' 
      });
    } else {
      Cookies.remove("token");
    }

    if (userId) {
      Cookies.set("userId", userId, { 
        expires: 7, 
        secure: true, 
        sameSite: 'strict' 
      });
    } else {
      Cookies.remove("userId");
    }

    Cookies.set("accessGranted", accessGranted ? "true" : "false", { 
      expires: 7, 
      sameSite: 'strict' 
    });
  }, [token, accessGranted, userId]);

  return (
    <LandingAuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        userId,
        setUserId,
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
  if (!context)
    throw new Error("useLandingAuth must be used within a LandingAuthProvider");
  return context;
};