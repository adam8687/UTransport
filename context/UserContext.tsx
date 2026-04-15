import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  utEID: string;
  email: string;
  phone: string;
  role: 'student' | 'employee';
  adaRequired: boolean;
  mobilityAids: string[];
  darRegistered: string;
  medDocUrl: string | null;
  studentType: string;
  residenceType: string;
  transportModes: string[];
  usedSureWalk: boolean;
  usedPTSPickup: boolean;
  termsSignature: string;
  profileComplete: boolean;
  pushToken: string | null;
}

interface DemoUser {
  uid: string;
}

interface UserContextType {
  firebaseUser: DemoUser | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  setUserProfile: (profile: UserProfile) => void;
  refreshProfile: () => Promise<void>;
  loginUser: (uid: string) => Promise<void>;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextType>({
  firebaseUser: null,
  userProfile: null,
  authLoading: true,
  setUserProfile: () => {},
  refreshProfile: async () => {},
  loginUser: async () => {},
  logoutUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<DemoUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  async function fetchProfile(uid: string) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      }
    } catch (e) {
      console.warn('fetchProfile error:', e);
    }
  }

  async function refreshProfile() {
    if (firebaseUser) await fetchProfile(firebaseUser.uid);
  }

  async function loginUser(uid: string) {
    setFirebaseUser({ uid });
    await fetchProfile(uid);
  }

  function logoutUser() {
    setFirebaseUser(null);
    setUserProfile(null);
  }

  useEffect(() => {
    // Demo mode — no real Firebase Auth, just mark loading as done
    setAuthLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ firebaseUser, userProfile, authLoading, setUserProfile, refreshProfile, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
