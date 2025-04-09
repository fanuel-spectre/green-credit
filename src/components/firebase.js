// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGLZQyiFPR5Pt40dE0U2-sbCHZoDdtI48",
  authDomain: "green-credit-cac54.firebaseapp.com",
  projectId: "green-credit-cac54",
  storageBucket: "green-credit-cac54.firebasestorage.app",
  messagingSenderId: "567189381304",
  appId: "1:567189381304:web:e12fbd25c7b5b65763d44d",
  measurementId: "G-GYW7QD7FKG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth=getAuth();
export const db=getFirestore(app);
export default app;