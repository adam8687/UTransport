/**
 * Enum representing the type of ride service requested.
 */
export enum RideType {
  SureWalk = 'SureWalk',
  Medical = 'Medical',
  PTS = 'PTS',
}

/**
 * Enum representing the current status of a ride request.
 */
export enum RideStatus {
  Waiting = 'waiting',
  Accepted = 'accepted',
  Arrived = 'arrived',
}

/**
 * Interface representing a ride request in the UT Austin ride-request app.
 * Each ride request is stored as a document in Firebase Firestore.
 */
export interface RideRequest {
  /** Unique identifier for the ride request */
  requestId: string;
  /** UT Austin student Electronic ID */
  studentEID: string;
  /** Location where the student will be picked up */
  pickupLocation: string;
  /** Location where the student will be dropped off */
  dropoffLocation: string;
  /** Type of ride service requested */
  type: RideType;
  /** Current status of the ride request */
  status: RideStatus;
  /** Timestamp of when the ride request was created */
  timestamp: Date;
}
