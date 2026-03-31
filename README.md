# AccessibilitySP26 — UT Campus Transportation App

We are improving transportation accessibility at UT by building on existing systems like SureWalk and PTS Pickup. Our solution integrates these into one app, adds a map for navigation within campus bounds, and introduces a new ride request system for medical needs, disabilities, and essential trips like UHS or pharmacies. Instead of phone calls, users receive real-time notifications after requesting a ride.

**Key advantages:**
- Centralized app (everything in one place)
- Better UX than current systems
- Real-time notifications (no more phone calls)
- Expanded use cases (not just fixed routes)

---

## Tech Stack
- **Frontend:** React Native (Expo) + TypeScript
- **Backend:** Firebase (Firestore, Auth, Storage, Cloud Messaging)
- **Maps:** React Native Maps (Google Maps)

---

## Project Structure

```
AccessibilitySP26/
├── src/
│   ├── screens/
│   │   ├── auth/           # Login, Signup (UT EID)
│   │   ├── user/           # Home, Map, Ride Request, Profile, Notifications
│   │   └── worker/         # Worker dashboard, active requests
│   ├── components/
│   │   ├── common/         # Buttons, Cards, Inputs, Modals
│   │   ├── map/            # MapView wrapper, markers, service bounds
│   │   └── notifications/  # Notification banners, ride status cards
│   ├── navigation/         # Stack + Tab navigators (user vs worker role)
│   ├── services/           # Firebase CRUD, Auth, Notifications, Storage
│   ├── hooks/              # useAuth, useRideRequest, useLocation
│   ├── context/            # AuthContext, RideContext
│   ├── utils/              # Helpers, formatters
│   └── constants/          # Colors, routes, service boundaries
├── assets/
│   ├── images/
│   └── fonts/
├── functions/              # Firebase Cloud Functions
├── .env.example
├── app.json
└── README.md




