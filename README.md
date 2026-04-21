# UTransport

A campus ride-request app built for UT Austin. Students can request a SureWalk escort or PTS medical pickup from their phone. Dispatchers see incoming rides in a live queue and claim them. Once claimed, the student gets a real-time map showing the driver approaching their pickup.

Built with Expo + React Native, Firebase Firestore, and react-native-maps.

---

## What it does

- **Students** log in, pick SureWalk or PTS Pickup, fill out a short form, and submit. They're dropped onto a status screen that shows a spinner while waiting, then switches to a live map once a driver is claimed.
- **Dispatchers** open the work portal and see all pending rides. They tap a card to claim it, which notifies the student and starts the live tracking simulation.
- The driver's position is shown on pre-calculated route toward pickup point. An ETA displays and confirmation notifications pop up.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Expo Router (file-based routing) |
| UI | React Native + react-native-reanimated |
| Maps | react-native-maps |
| Backend | Firebase Firestore (real-time listeners) |
| Auth | Custom UID-based login (demo mode) |
| Notifications | expo-notifications |

---

## Getting started

**Prerequisites:** Node.js v20 or v22 LTS, and the Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)).

```bash
git clone https://github.com/adam8687/AccessibilitySP26.git
cd AccessibilitySP26
npm install
```

You'll need a `firebaseConfig.js` in the root with the project credentials. Ask Adam if you don't have it — it's not committed for obvious reasons.

---

## Running on your phone

The `utexas` and `utguest` networks block the local dev server, so you have to use a tunnel:

```bash
npx expo start --tunnel
```

Scan the QR code with your camera (iPhone) or the Expo Go app (Android). That's it.

> If the tunnel hangs, kill it and try again — `@expo/ngrok` occasionally needs a retry on first launch.

---

## Project structure

```
app/
  (pre-auth)/       # Landing, login, sign-up, onboarding
  (student)/        # Student-facing tabs: home, request, status, history, profile
  (tabs)/           # Dispatcher/employee-facing screens
components/
  ui/               # Shared components (UTHeader, GlassCard, etc.)
context/
  UserContext.tsx   # Global auth + active ride state
assets/
  images/           # ut-header-banner.png, ut-logo.png, etc.
firebaseConfig.js   # Not committed — ask Adam
```

---

## Demo accounts

There are a handful of pre-seeded Firestore users for demoing. Ask Adam for the credentials.

---

## Known issues / limitations

- The driver route is currently a hardcoded simulation. It doesn't use real GPS.
- No payment or university integration; this is a prototype.

