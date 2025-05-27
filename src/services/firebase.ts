// src/services/firebase.ts

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();

// 🔐 Cross-platform Google Sign-In
export const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  if (Platform.OS === 'web') {
    try {
      const result = await auth.signInWithPopup(provider);
      console.log('✅ Web Google Sign-In:', result.user?.email);
      return result.user;
    } catch (error) {
      console.error('❌ Web Google Sign-In Error:', error);
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
        const credential = firebase.auth.GoogleAuthProvider.credential(
          null,
          result.params.access_token
        );
        const signInResult = await auth.signInWithCredential(credential);
        console.log('✅ Mobile Google Sign-In:', signInResult.user?.email);
        return signInResult.user;
      } else {
        console.log('⚠️ Mobile Google Sign-In canceled or failed', result);
      }
    } catch (error) {
      console.error('❌ Mobile Google Sign-In Error:', error);
    }
  }
};
