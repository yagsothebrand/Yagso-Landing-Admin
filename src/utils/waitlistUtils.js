import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

function generatePasscode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function checkEmailExists(email) {
  try {
    const q = query(collection(db, "waitlist"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        exists: true,
        tokenId: doc.id,
        passcode: doc.data().passcode,
      };
    }
    return { exists: false };
  } catch (err) {
    console.error("Error checking email:", err);
    return { exists: false };
  }
}

export async function addToWaitlist(email) {
  const passcode = generatePasscode();
  const docRef = await addDoc(collection(db, "waitlist"), {
    email,
    passcode,
    createdAt: serverTimestamp(),
    loginAttempt: 0,
    lastLogin: serverTimestamp(),
  });
  return { tokenId: docRef.id, passcode };
}

export async function sendWaitlistEmail(email, passcode, magicLink, tokenId) {
  const emailRes = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, passcode, magicLink, tokenId }),
  });

  if (!emailRes.ok) {
    throw new Error("Failed to send email");
  }

  return emailRes.json();
}

export async function createUserDocument(email, waitlistDocId) {
  try {
    const userRef = await addDoc(collection(db, "users"), {
      email,
      waitlistId: waitlistDocId,
      createdAt: serverTimestamp(),
    });
    return userRef.id; // Return docRefId to be stored as user ID
  } catch (err) {
    console.error("Error creating user document:", err);
    throw err;
  }
}

export async function updateWaitlistWithUserId(waitlistDocId, userId) {
  try {
    const waitlistRef = doc(db, "waitlist", waitlistDocId);
    await updateDoc(waitlistRef, {
      userId,
    });
  } catch (err) {
    console.error("Error updating waitlist with userId:", err);
    throw err;
  }
}
