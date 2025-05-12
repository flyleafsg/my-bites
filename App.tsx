import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView } from 'react-native';
import { auth, db } from './src/services/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

export default function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        try {
          const snapshot = await getDocs(collection(db, 'testCollection'));
          const docs = snapshot.docs.map(doc => doc.data());
          setMessage(`Signed in as: ${user.uid}\nDocs: ${JSON.stringify(docs)}`);
        } catch (error) {
          setMessage(`Firestore error: ${(error as Error).message}`);
        }
      }
    });

    signInAnonymously(auth).catch(error => {
      setMessage(`Sign-in failed: ${error.message}`);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ textAlign: 'center', padding: 16 }}>{message}</Text>
    </SafeAreaView>
  );
}
