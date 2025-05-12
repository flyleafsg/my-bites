# Expo + Firebase Starter Template

This is a minimal starter template for building React Native apps with [Expo SDK 53](https://docs.expo.dev) and Firebase. It includes:

- ✅ TypeScript setup
- ✅ Anonymous Firebase Auth
- ✅ Firestore read access
- ✅ Environment variable support via `.env`
- ✅ Compatible with Expo Go (no custom dev client required)

> Use this as a foundation for school tools, dashboards, student check-ins, or any real-time mobile app backed by Firebase.

---

## 🚀 Getting Started

### 1. Clone this Template

Click **"Use this template"** or clone it manually:

```bash
git clone https://github.com/your-username/expo-firebase-template.git
cd expo-firebase-template
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Firebase

Create a `.env` file at the root of the project based on the provided `.env.example`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

These values can be found in your Firebase Console under **Project Settings → General**.

---

### 4. Run the App

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your mobile device.

---

## 🔐 Firestore Rules for Development

To allow anonymous users to read from your test collection, use these temporary Firestore rules:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ For development only — lock these down before deploying to production.

---

## 📁 Project Structure

```
/src
  /services
    firebase.ts       # Firebase config + auth/firestore export
App.tsx               # Sign-in + Firestore fetch example
app.config.ts         # Loads .env and exposes to Expo
.env.example          # Copy this and create your own .env
```

---

## 📦 Built With

- [Expo](https://expo.dev/)
- [Firebase JS SDK](https://firebase.google.com/docs/web/setup)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 🧪 What's Next?

This template can be expanded with:

- 🔐 Email/password auth
- 🧾 Realtime schedule editing
- 📊 Analytics or user tracking
- 🔔 Notifications with Expo or Firebase Messaging
- 🎨 Dark mode toggle

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

Happy hacking! 🚀
