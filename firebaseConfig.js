import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
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

// React Native requires initializeAuth with AsyncStorage persistence so that
// the user session survives app restarts. Falls back to getAuth (in-memory)
// if @react-native-async-storage/async-storage isn't installed yet.
let auth;
try {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}
export { auth };

export const storage = getStorage(app);
