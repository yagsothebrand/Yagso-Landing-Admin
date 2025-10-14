import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase configuration using environment variables

const firebaseConfig = {
  apiKey: "AIzaSyDJGb43_z_RSQ3guah9V1Yx7-CJsaCu7b4",
  authDomain: "yagso-89499.firebaseapp.com",
  projectId: "yagso-89499",
  storageBucket: "yagso-89499.firebasestorage.app",
  messagingSenderId: "339377343543",
  appId: "1:339377343543:web:97a12e0658d1c42cb443b2",
  measurementId: "G-0FGZKE1XGH",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, doc, setDoc, auth };
