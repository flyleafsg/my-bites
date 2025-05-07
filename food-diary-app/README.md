# 🥗 Food Diary App

A mobile-first food tracking app built with React Native using Expo.  
The app helps users log their meals (breakfast, lunch, dinner, snacks), track water intake, and manage a list of favorite foods. Designed for future API integration and app store deployment.

---

## 📱 Features

- Log meals by category: Breakfast, Lunch, Dinner, Snacks
- Track daily water intake
- Save and quickly select favorite foods
- Clean and modern UI, optimized for mobile
- Local storage with AsyncStorage (initial version)
- Scalable architecture ready for Firebase or REST API integration

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (LTS version)  
  [https://nodejs.org/](https://nodejs.org/)
- Expo CLI  
  Install globally with:

  ```bash
  npm install -g expo-cli

### (Optional) Install Expo Go on your iOS/Android phone for mobile preview

📦 Installation

1. Clone or create the project folder:

npx create-expo-app food-diary-app
cd food-diary-app

2. Start the development server:

npx expo start

3. Open your device:

* Scan the QR code with the Expo Go app
* or press w to run in your browser

📁 File Structure

food-diary-app/
├── App.js                    # Root component
├── assets/                  # App images, icons
│   └── images/
├── components/              # Reusable UI components
│   ├── MealCard.js
│   └── WaterTracker.js
├── constants/               # Theme colors, constants
│   └── colors.js
├── navigation/              # App navigation config
│   └── AppNavigator.js
├── screens/                 # Screen views
│   ├── HomeScreen.js
│   ├── LogMealScreen.js
│   ├── WaterScreen.js
│   ├── FavoritesScreen.js
│   └── SettingsScreen.js
├── storage/                 # Local storage functions
│   └── storage.js
├── utils/                   # Helper functions
│   └── helpers.js
├── .gitignore
├── package.json
└── README.md

📌 Roadmap

 Set up React Native + Expo environment

 Design home screen layout

 Implement meal logging with local persistence

 Add water tracking and favorite food list

 Enable Firebase integration for user data sync

 Prepare app for Google Play / App Store submission

🛠️ Tech Stack

React Native (Expo)

React Navigation

AsyncStorage (for data persistence)

Tailwind via NativeWind (optional styling enhancement)

Firebase (planned integration)

