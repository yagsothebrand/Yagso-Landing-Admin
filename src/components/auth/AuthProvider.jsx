import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Cookies from "js-cookie";

const AuthContext = createContext();

const USER_COOKIE = "jovial_user";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load from cookie for instant UI
  useEffect(() => {
    try {
      const savedUser = Cookies.get(USER_COOKIE);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      }
    } catch (error) {
      console.error("Error loading user from cookie:", error);
      Cookies.remove(USER_COOKIE, { path: "/" });
    }
  }, []);

  const persistCookie = useCallback((u) => {
    if (!u) {
      Cookies.remove(USER_COOKIE, { path: "/" });
      return;
    }

    Cookies.set(USER_COOKIE, JSON.stringify(u), {
      expires: 30,
      path: "/",
      sameSite: "Lax",
    });
  }, []);

  // ✅ Internal: refresh with a firebase auth user
  const refreshUserWithFirebaseUser = useCallback(
    async (firebaseUser) => {
      if (!firebaseUser?.uid) return null;

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const data = userDoc.exists() ? userDoc.data() : {};

      const merged = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        ...data,
      };

      setUser(merged);
      persistCookie(merged);
      return merged;
    },
    [persistCookie],
  );

  // ✅ Public: refresh using current auth user (call this from anywhere)
  const refreshUser = useCallback(async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;
    return refreshUserWithFirebaseUser(firebaseUser);
  }, [refreshUserWithFirebaseUser]);

  // ✅ Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          await refreshUserWithFirebaseUser(firebaseUser);
        } else {
          setUser(null);
          persistCookie(null);
        }
      } catch (err) {
        console.error("Auth state handler error:", err);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [persistCookie, refreshUserWithFirebaseUser]);
  // AuthProvider.jsx (inside your provider)

  const register = async (email, password, extra = {}) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(
      doc(db, "users", cred.user.uid),
      {
        email,
        ...extra,
        createdAt: serverTimestamp(), // ✅ better than new Date()
      },
      { merge: true },
    );

    // ✅ Optional but helpful: immediately sync local state/cookie
    // so UI updates faster even before onAuthStateChanged finishes
    await refreshUserWithFirebaseUser(cred.user);

    return cred.user;
  };

  const saveBillingInfo = async (billingData, uidOverride) => {
    const uid = uidOverride || user?.uid;
    if (!uid) throw new Error("User not logged in");

    const userRef = doc(db, "users", uid);

    // if we're saving for a UID that isn't the current `user` yet,
    // we can't safely dedupe from local state — so fetch from Firestore
    let existingBilling = user?.uid === uid ? user.billingInfo || [] : [];

    if (user?.uid !== uid) {
      const snap = await getDoc(userRef);
      const data = snap.exists() ? snap.data() : {};
      existingBilling = Array.isArray(data.billingInfo) ? data.billingInfo : [];
    }

    const isDuplicate = existingBilling.some(
      (saved) =>
        saved.address === billingData.address &&
        saved.city === billingData.city &&
        saved.fullName === billingData.fullName,
    );

    if (isDuplicate) return;

    await updateDoc(userRef, {
      billingInfo: arrayUnion(billingData),
    });

    // ✅ If the local `user` matches this uid, update local state + cookie
    if (user?.uid === uid) {
      const updatedUser = {
        ...user,
        billingInfo: [...existingBilling, billingData],
      };
      setUser(updatedUser);
      persistCookie(updatedUser);
    } else {
      // Otherwise, refresh from firebase auth user if available
      // (helps the UI become consistent after signup)
      if (auth.currentUser?.uid === uid) {
        await refreshUserWithFirebaseUser(auth.currentUser);
      }
    }
  };

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user; // ✅ IMPORTANT
  };

  const logout = async (clearGuestCart) => {
    await signOut(auth);
    persistCookie(null);

    if (clearGuestCart) clearGuestCart();
  };

  const getBillingInfo = () => user?.billingInfo || [];
  const isAdmin = Boolean(user?.isAdmin);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    saveBillingInfo,
    getBillingInfo,
    isAdmin,
    refreshUser, // ✅ now no-arg, use in ProfilePage after updateDoc
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
