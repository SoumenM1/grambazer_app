# 📱 GramBazer Mobile App

A scalable **React Native mobile application** for the GramSeba ecosystem, designed to enable village-based marketplaces, real-time communication, and location-aware services directly from mobile devices.

---

## 🚀 Features

- 🔐 JWT-based Authentication (Login / Signup)
- 🛒 Marketplace (browse shops, products, orders)
- 📡 Real-time Notifications (Socket.io)
- 📍 Location-based Services (nearby shops & users)
- 🔔 Push Notifications (Firebase-ready)
- ⚡ Fast & optimized performance
- 📱 Cross-platform (Android & iOS)
- 🌐 Seamless API integration with GramSeba backend

---

## 🏗️ Tech Stack

- **Framework:** React Native (CLI / Expo)
- **Navigation:** React Navigation
- **State Management:** Redux Toolkit / Context API
- **API Client:** Axios
- **Realtime:** Socket.io Client
- **Storage:** AsyncStorage / Secure Storage
- **Push Notifications:** Firebase Cloud Messaging (FCM)
- **Maps & Location:** React Native Maps / Geolocation

---

## 📂 Project Structure

grambazer-mobile/
│
├── android/
├── ios/
│
├── src/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── services/        # API calls
│   ├── store/           # Redux / Context
│   ├── hooks/
│   ├── utils/
│   └── assets/
│
├── App.js
├── package.json
└── README.md
⚙️ Environment Setup

Create a .env file:

API_URL=http://YOUR_SERVER_IP:5000
SOCKET_URL=http://YOUR_SERVER_IP:5000

⚠️ Use your local IP instead of localhost when testing on a real device.

🚀 Getting Started
1️⃣ Clone Repository
git clone https://github.com/your-username/grambazer-mobile.git
cd grambazer-mobile
2️⃣ Install Dependencies
npm install
3️⃣ Start Metro Server
npm start
4️⃣ Run App
▶️ Android
npm run android
▶️ iOS
npm run ios
🔗 API Integration

Example Axios setup:

import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_URL,
});

export default api;
📡 Real-Time (Socket.io)
import { io } from "socket.io-client";

const socket = io(process.env.SOCKET_URL);

export default socket;
🔐 Authentication Flow
User → Login/Register → Receive JWT → Store Token → Access Protected Screens
📍 Location Features
Detect user location
Show nearby shops
Location-based notifications
🔔 Push Notifications (FCM)
Receive real-time alerts
Order updates
Promotional notifications
🧩 Core Screens
🏠 Home
🛒 Marketplace
🏪 Shop Details
👤 Profile
🔔 Notifications
🔐 Login / Signup
📦 Build APK / IPA
Android APK
cd android
./gradlew assembleRelease

APK location:

android/app/build/outputs/apk/release/
iOS Build
cd ios
pod install

Then open in Xcode and build.

⚡ Performance Optimization
Lazy loading screens
Optimized images
API caching
Efficient state management
🔒 Security Best Practices
Secure token storage
HTTPS API calls
Input validation
API rate limiting (backend)
🚀 Future Improvements
Offline mode (local storage sync)
Multi-language support (regional languages)
Dark mode UI
Voice-based search
AI-based recommendations
🤝 Contribution

Contributions are welcome! Fork the repo and submit pull requests.

👨‍💻 Author

Soumen Maity
Mobile & Full Stack Developer
Focused on scalable apps, real-time systems, and cloud-native architecture.
