import 'dotenv/config';

export default {
  expo: {
    name: 'My Bites',
    slug: 'my-bites',
    owner: 'chrisgins', // Replace with your actual Expo username
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'com.yourcompany.mybites'
    },
    android: {
      package: 'com.yourcompany.mybites'
    },
    plugins: ['expo-web-browser'],
    extra: {
      EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      GOOGLE_AUTH_EXPO_CLIENT_ID: process.env.GOOGLE_AUTH_EXPO_CLIENT_ID,
      GOOGLE_AUTH_IOS_CLIENT_ID: process.env.GOOGLE_AUTH_IOS_CLIENT_ID,
      GOOGLE_AUTH_ANDROID_CLIENT_ID: process.env.GOOGLE_AUTH_ANDROID_CLIENT_ID,
      eas: {
        projectId: 'bf2f653d-e28e-43f4-b281-2865a2449bcc'
      }
    }
  }
};
