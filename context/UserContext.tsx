import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'student' | 'employee' | null;

export interface UserInfo {
  email: string;
  username?: string;
  role: UserRole;
}

interface UserContextType {
  userInfo: UserInfo | null;
  hasSignedUp: boolean;
  setUserInfo: (info: UserInfo) => void;
  setHasSignedUp: (value: boolean) => void;
}

const UserContext = createContext<UserContextType>({
  userInfo: null,
  hasSignedUp: false,
  setUserInfo: () => {},
  setHasSignedUp: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [hasSignedUp, setHasSignedUp] = useState(false);

  return (
    <UserContext.Provider value={{ userInfo, hasSignedUp, setUserInfo, setHasSignedUp }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
