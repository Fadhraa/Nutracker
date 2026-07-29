import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB2NbrI3_Ch_bjrIu5x0oA-1sSxPczeP4g",
  authDomain: "nutracker.firebaseapp.com",
  projectId: "nutracker",
  storageBucket: "nutracker.firebasestorage.app",
  messagingSenderId: "114879196471",
  appId: "1:114879196471:web:91e0719a42919483a8beb2",
  measurementId: "G-QMCE3VMFD6"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);