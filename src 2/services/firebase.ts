import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, inMemoryPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDGq4XUlwCDn0EJvECjkbZbqCyuR-n12QU',
  authDomain: 'ut-surewalkpts-integration-app.firebaseapp.com',
  projectId: 'ut-surewalkpts-integration-app',
  storageBucket: 'ut-surewalkpts-integration-app.firebasestorage.app',
  messagingSenderId: '268631531286',
  appId: '1:268631531286:android:795f99fb7a9e51551f3a37',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
setPersistence(auth, inMemoryPersistence);

export const db = getFirestore(app);
