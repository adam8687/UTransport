import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 1. Add this import

const firebaseConfig = {
  apiKey: "AIzaSyDeq05fgcbKIgDqGkHU8U2rWyVIdc8ZSaA",
  authDomain: "ut-surewalkpts-integration-app.firebaseapp.com",
  projectId: "ut-surewalkpts-integration-app",
  storageBucket: "ut-surewalkpts-integration-app.firebasestorage.app",
  messagingSenderId: "268631531286",
  appId: "1:268631531286:web:b3c7bc4818d336e51f3a37",
  measurementId: "G-LKR7TY1C4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Export the database so you can use it in other files
export const db = getFirestore(app);