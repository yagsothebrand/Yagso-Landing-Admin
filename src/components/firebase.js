// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDJGb43_z_RSQ3guah9V1Yx7-CJsaCu7b4",
  authDomain: "yagso-89499.firebaseapp.com",
  projectId: "yagso-89499",
  storageBucket: "yagso-89499.appspot.app",
  messagingSenderId: "339377343543",
  appId: "1:339377343543:web:97a12e0658d1c42cb443b2",
  measurementId: "G-0FGZKE1XGH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { db, doc, setDoc, auth, analytics, storage };
