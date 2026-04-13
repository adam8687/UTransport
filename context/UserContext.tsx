import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';

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

interface UserContextType {
  firebaseUser: User | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  setUserProfile: (profile: UserProfile) => void;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  firebaseUser: null,
  userProfile: null,
  authLoading: true,
  setUserProfile: () => {},
  refreshProfile: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await fetchProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  return (
    <UserContext.Provider value={{ firebaseUser, userProfile, authLoading, setUserProfile, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
