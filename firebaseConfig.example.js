/**
 * Firebase configuration template.
 *
 * 1. Copy this file:  cp firebaseConfig.example.js firebaseConfig.js
 * 2. Fill in the values from your Firebase project console:
 *    https://console.firebase.google.com → Project Settings → Your Apps
 * 3. firebaseConfig.js is git-ignored; never commit real credentials.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID', // optional
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// React Native requires initializeAuth with AsyncStorage persistence so the
// session survives app restarts. Falls back to getAuth (in-memory) if
// @react-native-async-storage/async-storage is not installed.
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
