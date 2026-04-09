import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeq05fgcbKIgDqGkHU8U2rWyVIdc8ZSaA",
  authDomain: "ut-surewalkpts-integration-app.firebaseapp.com",
  projectId: "ut-surewalkpts-integration-app",
  storageBucket: "ut-surewalkpts-integration-app.firebasestorage.app",
  messagingSenderId: "268631531286",
  appId: "1:268631531286:web:b3c7bc4818d336e51f3a37",
  measurementId: "G-LKR7TY1C4C"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);