# UTransport

> A real-time campus transportation request app for UT Austin connecting students with SureWalk escorts and PTS medical pickups through a live dispatch interface.

---

## Overview

UTransport digitizes UT Austin's existing campus-safety transportation services. Students submit a ride request from their phone; dispatchers see it instantly in a live queue and claim it with one tap; the student is then shown a live map of the driver approaching their pickup point, complete with an animated route and ETA countdown.

The project was built as a full end-to-end prototype to explore real-time mobile UX patterns using Firebase Firestore's WebSocket-backed listeners, animated route simulation with `react-native-reanimated`, and a role-based auth model without a dedicated backend server.

---

## Feature Highlights

| User role | Capability |
|---|---|
| **Student** | Sign up → onboarding survey → request SureWalk or PTS pickup → live status + animated driver map |
| **Dispatcher** | Real-time ride queue via Firestore `onSnapshot` → claim a ride in one tap → student notified instantly |
| **Shared** | Push notifications (expo-notifications), persistent session (AsyncStorage), animated transitions throughout |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Expo Router (file-based)                 │
│  (pre-auth)/   (student)/(tabs)/   (tabs)/  [dispatcher]    │
└────────────────────────┬────────────────────────────────────┘
                         │  React Context  (UserContext)
                         │  UID-based session + profile cache
                         │
             ┌───────────▼───────────┐
             │   Firebase Firestore   │  real-time listeners (onSnapshot)
             │   Collections:         │  + one-shot reads (getDocs)
             │   • users             │
             │   • rides             │
             │   • rideRequests      │
             └───────────────────────┘
```

**Key technical decisions:**

- **No dedicated backend** — Firestore security rules + client-side Firestore SDK handle all data access. This keeps the demo self-contained and deployable with zero server infrastructure.
- **Role-based routing** — after login the app inspects `profile.role` (`'student'` | `'employee'`) and `profile.profileComplete`, then uses `router.replace()` to land users in the correct tab group. No JWT middleware required.
- **Simulated driver route** — a pre-calculated polyline from a fixed spawn point to the student's pickup is animated with `react-native-reanimated` shared values, producing smooth 60 fps motion without a real GPS feed. Swapping in a live location feed requires only replacing the interval-driven waypoint logic with a Firestore geo-update listener.
- **Shared design tokens** — brand colors and service-availability helpers live in `constants/theme.ts` and `utils/serviceHelpers.ts` so every screen stays in sync without magic strings.

---

## Tech Stack

| Layer | Library / Service |
|---|---|
| Framework | [Expo](https://expo.dev) + [Expo Router](https://expo.github.io/router) v6 (file-based routing) |
| UI | React Native + [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) v4 |
| Maps | [react-native-maps](https://github.com/react-native-maps/react-native-maps) |
| Backend / DB | [Firebase Firestore](https://firebase.google.com/docs/firestore) (real-time listeners) |
| Auth | Custom UID-based demo auth via Firestore lookup |
| Push Notifications | [expo-notifications](https://docs.expo.dev/push-notifications/overview/) |
| State | React Context + `useState` / `useEffect` hooks |
| Language | TypeScript (strict mode) |

---

## Project Structure

```
app/
  (pre-auth)/         # Unauthenticated flow: landing, login, sign-up, onboarding
  (student)/(tabs)/   # Student-facing tabs: home, request, status, history, profile
  (student)/ride-status/[id].tsx   # Dynamic ride-status detail screen
  (tabs)/             # Dispatcher-facing tabs: work portal, portal, history, profile
components/
  ui/                 # Shared components: UTHeader, GlassCard, GlassButton, FloatingTabBar
constants/
  theme.ts            # BrandColors, Colors, Fonts — single source of truth
context/
  UserContext.tsx     # Global auth state, active ride ID, profile cache
utils/
  serviceHelpers.ts   # isSureWalkOpen(), getCountdown(), getGreeting()
assets/
  images/             # App icons, UT header banner
firebaseConfig.example.js  # Config template — copy to firebaseConfig.js and fill in values
```

---

## Getting Started

**Prerequisites:** Node.js ≥ 20 LTS and the [Expo Go](https://expo.dev/go) app on your device.

```bash
git clone https://github.com/adam8687/AccessibilitySP26.git
cd AccessibilitySP26
npm install

# Set up Firebase credentials
cp firebaseConfig.example.js firebaseConfig.js
# Open firebaseConfig.js and fill in your Firebase project values
# (Firebase Console → Project Settings → Your Apps)
```

### Running on a device

The `utexas` and `utguest` campus networks block the local dev server. Use the tunnel flag:

```bash
npx expo start --tunnel
```

Scan the QR code with your camera (iOS) or the Expo Go app (Android).

> `@expo/ngrok` occasionally needs a retry on first launch if the tunnel hangs just kill and restart.

---

## Demo Accounts

The Firestore database is seeded with several test accounts covering both student and dispatcher roles. Email/password credentials are available on request for live demos.

---

## Known Limitations & Roadmap

|  Demo only | Driver route is a hardcoded simulation; replacing the interval with a Firestore geo-update listener would enable real GPS tracking |
|  Demo only | Auth uses a Firestore email-lookup instead of Firebase Authentication; production would use Firebase Auth with proper ID tokens |
|  Planned | Ride history pagination and analytics dashboard for dispatchers |
|  Planned | Integration with UT's official DAR (Disability Accommodation Resources) system |
|  Planned | Driver-side app and two-way ETA updates |

