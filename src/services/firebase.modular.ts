// firebase.modular.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

// Firebase config from app.config.ts -> extra
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (safe for hot reload/dev tools)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// 🔐 Cross-platform Google Sign-In using modular SDK
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  if (Platform.OS === 'web') {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Web Google Sign-In:', result.user?.email);
      return result.user;
    } catch (error) {
      console.error('❌ Web Google Sign-In Error:', error);
      return null;
    }
  } else {
    try {
      const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
      const result = await AuthSession.startAsync({
        authUrl:
          `https://accounts.google.com/o/oauth2/v2/auth` +
          `?response_type=token` +
          `&client_id=${Constants.expoConfig?.extra?.GOOGLE_AUTH_EXPO_CLIENT_ID}` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&scope=profile email`,
      });

      if (result.type === 'success') {
        const credential = GoogleAuthProvider.credential(
          null,
          result.params.access_token
        );
        const signInResult = await signInWithCredential(auth, credential);
        console.log('✅ Mobile Google Sign-In:', signInResult.user?.email);
        return signInResult.user;
      } else {
        console.log('⚠️ Mobile Google Sign-In canceled or failed:', result);
        return null;
      }
    } catch (error) {
      console.error('❌ Mobile Google Sign-In Error:', error);
      return null;
    }
  }
};
