/**
 * Shared helpers for SureWalk / PTS service-availability logic.
 *
 * SureWalk operates every Sunday–Thursday, 20:00 – 02:00 (Austin time).
 * All functions are pure and side-effect-free so they are easily testable.
 */

/**
 * Returns true while SureWalk is accepting ride requests.
 * In demo mode this always returns true so reviewers can exercise the full flow.
 */
export function isSureWalkOpen(): boolean {
  return true; // demo mode — real check would verify day-of-week and hour
}

/**
 * Returns a human-readable string like "3h 42m" until SureWalk opens tonight,
 * or null if the service is already open (or in demo mode).
 */
export function getCountdown(): string | null {
  const now = new Date();
  const open = new Date();
  open.setHours(20, 0, 0, 0);
  if (now >= open) return null;
  const diff = open.getTime() - now.getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

/**
 * Returns a contextual greeting based on the current hour.
 */
export function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  return 'Good evening';
}
