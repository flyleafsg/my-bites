import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Title } from 'react-native-paper';
import { db, auth } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { calculateHydrationStreak } from '../utils/calculateStreak';
import { WaterEntry } from '../types/types';

const HomeScreen = () => {
  const [hydrationStreak, setHydrationStreak] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const waterRef = collection(db, 'users', firebaseUser.uid, 'water');
        const q = query(waterRef);

        const unsubscribeWater = onSnapshot(q, (snapshot) => {
          const entries: WaterEntry[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp?.toDate?.() ?? new Date(data.timestamp);
            const amount = Number(data.amount ?? data.ounces);
            return { id: doc.id, timestamp, amount };
          });

          const streak = calculateHydrationStreak(entries);
          setHydrationStreak(streak);
        });

        return () => unsubscribeWater();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Meal Diary Dashboard</Title>
      {user && <Text style={styles.email}>Signed in as: {user.email}</Text>}
      <Text style={styles.streak}>
        Hydration Streak: <Text style={styles.emoji}>💧 {hydrationStreak} Days</Text>
      </Text>

      <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('LogMealScreen' as never)}>
        Log Meal
      </Button>

      <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('LogWaterScreen' as never)}>
        Log Water
      </Button>

      <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('MealHistoryScreen' as never)}>
        View Meal History
      </Button>

      <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('WaterHistoryScreen' as never)}>
        View Water History
      </Button>

      <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('BadgeCollectionScreen' as never)}>
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
    marginBottom: 10,
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
