// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGLZQyiFPR5Pt40dE0U2-sbCHZoDdtI48",
  authDomain: "green-credit-cac54.firebaseapp.com",
  projectId: "green-credit-cac54",
  storageBucket: "green-credit-cac54.appspot.com", // 🔁 NOTE: fix `.app` to `.appspot.com`
  messagingSenderId: "567189381304",
  appId: "1:567189381304:web:e12fbd25c7b5b65763d44d",
  measurementId: "G-GYW7QD7FKG",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Corrected export

export default app;
