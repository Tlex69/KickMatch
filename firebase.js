// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ค่าคอนฟิกของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyBzahVeU43EvdC4JUmp7_lVEvTuSb2pq0o",
  authDomain: "kickmatch-1e26c.firebaseapp.com",
  projectId: "kickmatch-1e26c",
  storageBucket: "kickmatch-1e26c.appspot.com",
  messagingSenderId: "53642285204",
  appId: "1:53642285204:web:9f4ed82a95284116486481",
};

// ป้องกันการ initialize ซ้ำ
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
