import { db } from "@/components/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
  increment,
} from "firebase/firestore";

const WAITLIST_COL = "waitlist";

export const generatePasscode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export async function findWaitlistByEmail(email) {
  const clean = String(email || "")
    .trim()
    .toLowerCase();
  if (!clean) return null;

  const q = query(collection(db, WAITLIST_COL), where("email", "==", clean));
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function getWaitlistByToken(tokenId) {
  if (!tokenId) return null;
  const ref = doc(db, WAITLIST_COL, tokenId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createWaitlistEntry(email) {
  const clean = String(email || "")
    .trim()
    .toLowerCase();
  const passcode = generatePasscode();

  const ref = await addDoc(collection(db, WAITLIST_COL), {
    email: clean,
    passcode,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLogin: null,
    loginAttempt: 0, // ✅ will become 1 after link click
    emailSendCount: 0,
    lastEmailSentAt: null,
  });

  return { tokenId: ref.id, passcode, email: clean };
}

export async function touchWaitlist(tokenId, updates = {}) {
  if (!tokenId) return;
  await updateDoc(doc(db, WAITLIST_COL, tokenId), {
    updatedAt: serverTimestamp(),
    ...updates,
  });
}

// ✅ called when link is clicked (grant access forever)
export async function markWaitlistLogin(tokenId) {
  if (!tokenId) return;
  await updateDoc(doc(db, WAITLIST_COL, tokenId), {
    updatedAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    loginAttempt: 1, // ✅ forever access rule
  });
}

export async function sendWaitlistEmail({
  email,
  passcode,
  tokenId,
  magicLink,
  isResend,
}) {
  // Replace later with backend call
  // await fetch("/api/waitlist", { ... })
  if (isResend) {
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
  await updateDoc(doc(db, WAITLIST_COL, tokenId), {
    updatedAt: serverTimestamp(),
    lastEmailSentAt: serverTimestamp(),
    emailSendCount: increment(1),
  });

  return { success: true };
}

/**
 * ✅ Updated:
 * - if existing and loginAttempt >= 1 => grantForever = true (skip email)
 * - else create/send email
 */
export async function requestWaitlistAccess(email) {
  const existing = await findWaitlistByEmail(email);

  if (existing?.id) {
    const tokenId = existing.id;
    const passcode = existing.passcode || generatePasscode();
    const loginAttempt = Number(existing.loginAttempt || 0);

    // safety if passcode missing
    if (!existing.passcode) {
      await touchWaitlist(tokenId, { passcode });
    }

    // ✅ forever access after first successful login
    if (loginAttempt >= 1) {
      return {
        isExisting: true,
        tokenId,
        passcode,
        email: existing.email,
        grantForever: true,
      };
    }

    return {
      isExisting: true,
      tokenId,
      passcode,
      email: existing.email,
      grantForever: false,
    };
  }

  const created = await createWaitlistEntry(email);
  return { isExisting: false, grantForever: false, ...created };
}
