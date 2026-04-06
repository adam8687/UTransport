Node.js (v20 or v22 LTS recommended)

Expo Go App: Download on iOS or Android

2. Installation
Clone the repository and install the dependencies:

Bash
git clone https://github.com/[your-username]/UT-Transportation-App.git
cd UT-Transportation-App
npm install
3. Firebase Configuration
Ensure you have a firebaseConfig.js file in the root directory with your API keys. (Ask Adam if you don't have this file!)

4. Running the App (UT Wi-Fi Fix)
Because the utexas and utguest networks block local connections, you must use a tunnel to see the app on your phone:

Bash
npx expo start --tunnel
Scan the QR code that appears in your terminal using your phone’s camera (iPhone) or the Expo Go app (Android).
