import React, { useEffect, useState, createContext, useContext } from "react";
import PropTypes from "prop-types";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [emailLogs, setEmailLogs] = useState([]);
  const toast = useToast();
  const [loadingGetUserInformation, setLoadingGetUserInformation] =
    useState(true);
  const [allUsers, setAllUsers] = useState([]); // 🔥 for admin list

  const auth = getAuth();
  const db = getFirestore();

  // ✅ Fetch single user details
  const getUserInfo = async (authId) => {
    console.log(authId);
    if (!authId) return null;
    setLoadingGetUserInformation(true);

    try {
      const userRef = doc(db, "users", authId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = { id: authId, ...userSnap.data() };
        setUser(userData);
        getAllUsers();
        return userData;
      } else {
        console.warn("No user found in Firestore with this authId");
        return null;
      }
    } catch (error) {
      toast({ title: "Error fetching user data:", error });
      return null;
    } finally {
      setLoadingGetUserInformation(false);
    }
  };
  console.log(user);

  // ✅ Fetch all employees (for admin dashboard)
  const getAllUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllUsers(usersList);
      setLoading(false);
    } catch (error) {
      toast({ title: "Error fetching all users:", error });
      setLoading(false);
    }
  };

  // ✅ Update status (active/inactive)
  const updateUserField = async (uid, field, newStatus) => {
    console.log(uid);
    setLoader(true);
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { [field]: newStatus });

      await getUserInfo(user.authId);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      toast({ title: "Error updating status:", error });
      console.error("Error updating status:", error);
    }
  };

  const updateUserProfile = async (uid, updates) => {
    setLoader(true);
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      // Refresh user data
      await getUserInfo(uid);
      setLoader(false);
      return { success: true };
    } catch (error) {
      setLoader(false);
      console.error("Error updating user profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteUpdateUserProfile = async (uid) => {
    try {
      setLoader(true);
      await deleteDoc(doc(db, "users", uid));
      await getAllUsers(); // refresh list
      setLoader(false);
      return { success: true };
    } catch (error) {
      toast({ title: "Error deleting user:", error });
      setLoader(false);
      return { success: false, error: error.message };
    }
  };

  const getEmailLogs = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "sentEmails"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(usersList);
      setEmailLogs(usersList);
      setLoading(false);
    } catch (error) {
      toast({ title: "Error fetching all users:", error });
      setLoading(false);
    }
  };
  // if (loadingGetUserInformation && !user && !allUsers) {
  //   return <div> Loading </div>;
  // }
  // ✅ Track login and update lastLogin field
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        // if (userSnap.exists()) {
        //   // update lastLogin
        //   await updateDoc(userRef, { lastLogin: serverTimestamp() });
        // } else {
        //   // create doc if missing
        //   await setDoc(userRef, {
        //     email: firebaseUser.email,
        //     role: "Personnel",
        //     status: "active",
        //     lastLogin: serverTimestamp(),
        //   });
        // }

        await getUserInfo(firebaseUser.uid);
        await getAllUsers();
        await getEmailLogs();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // ✅ logout
  const logout = async () => {
    await signOut(auth);

    setAllUsers(null);
    localStorage.removeItem("currentPage");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        allUsers,
        getAllUsers,
        updateUserField,
        getEmailLogs,
        emailLogs,
        updateUserProfile, // Add this new function
        loadingGetUserInformation,
        deleteUpdateUserProfile,
        getUserInfo,
        setLoading,
        loading,
        logout,
        loader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
