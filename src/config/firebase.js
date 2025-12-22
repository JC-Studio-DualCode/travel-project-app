// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // messagingSenderId is optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports for use in your app
export const auth = getAuth(app);              // For login/signup
export const provider = new GoogleAuthProvider(); // For Google login
export const db = getFirestore(app);           // For Firestore data
export const storage = getStorage(app);        // Optional: for user-uploaded files
