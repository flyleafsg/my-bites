import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Title } from 'react-native-paper';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { calculateHydrationStreak } from '../utils/calculateStreak';

type WaterEntry = {
  amount: number;
  timestamp: Date;
};

const HomeScreen = () => {
  const [hydrationStreak, setHydrationStreak] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log('✅ Firebase user signed in:', firebaseUser.uid);
        setUser(firebaseUser);

        const waterRef = collection(db, 'users', firebaseUser.uid, 'water');
        const q = query(waterRef);

        const unsubscribeWater = onSnapshot(q, (snapshot) => {
          const entries: WaterEntry[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            console.log('📦 Raw water doc data:', data);

            const timestamp = data.timestamp?.toDate?.() ?? new Date(data.timestamp);
            const amount = Number(data.amount ?? data.ounces);
            console.log('🏠 Water log for streak:', { timestamp, amount });

            return { timestamp, amount };
          });

          const streak = calculateHydrationStreak(entries);
          console.log('🏠 Hydration streak (Home):', streak);
          setHydrationStreak(streak);
        });

        // Cleanup Firestore listener
        return () => unsubscribeWater();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Meal Diary Dashboard</Title>
      <Text style={styles.subtitle}>Welcome to Meal Diary</Text>
      {user && (
        <Text style={styles.email}>Signed in as: {user.email}</Text>
      )}
      <Text style={styles.streak}>
        Hydration Streak: <Text style={styles.emoji}>💧 {hydrationStreak} Days</Text>
      </Text>

      <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('LogMeal')}>
        Log Meal
      </Button>
      <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('LogWater')}>
        Log Water
      </Button>
      <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('MealHistory')}>
        View Meal History
      </Button>
      <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('WaterHistory')}>
        View Water History
      </Button>
      <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('BadgeCollection')}>
        View Badges
      </Button>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6A1B9A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginBottom: 8,
  },
  email: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 4,
    color: '#444',
  },
  streak: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    color: '#1976D2',
  },
  emoji: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  button: {
    marginVertical: 8,
    borderRadius: 20,
  },
});
