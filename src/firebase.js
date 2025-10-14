import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase configuration using environment variables

const firebaseConfig = {
  apiKey: "AIzaSyAeeEh4DfPg0xAaPtDqE726ds-OkheUKZ0",
  authDomain: "osondu-ba2a6.firebaseapp.com",
  projectId: "osondu-ba2a6",
  storageBucket: "osondu-ba2a6.firebasestorage.app",
  messagingSenderId: "813833532483",
  appId: "1:813833532483:web:2fe5d1ff391489cbca90f6",
  measurementId: "G-WCJMYK2RF7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, doc, setDoc, auth };
