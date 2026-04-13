export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  utEID: string;
  phoneNumber: string;
  adaRequired: boolean;
  termsAcknowledged: boolean;
  termsSignature: string;
  role: 'student' | 'employee';
  createdAt: number; // Unix timestamp (ms)
}
