import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth, db, signInWithGoogle } from '../services/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { calculateHydrationStreak } from '../utils/calculateStreak';

type WaterEntry = {
  timestamp: number | Date;
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hydrationStreak, setHydrationStreak] = useState<number>(0);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email ?? null);

        const waterRef = collection(db, 'users', user.uid, 'water');
        const q = query(waterRef);

        const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
          const entries: WaterEntry[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            const rawTimestamp = data.timestamp;
            return {
              timestamp: rawTimestamp?.toDate?.() ?? new Date(rawTimestamp),
            };
          });

          const streak = calculateHydrationStreak(entries);
          setHydrationStreak(streak);
        });

        // ✅ unsubscribe Firestore when component unmounts
        return () => unsubscribeFirestore();
      } else {
        setUserEmail(null);
        setHydrationStreak(0);
      }
    });

    // ✅ unsubscribe auth listener on unmount
    return () => unsubscribeAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Meal Diary Dashboard</Title>
      <Text style={styles.subtitle}>Welcome to Meal Diary</Text>

      {userEmail ? (
        <>
          <Text style={styles.signedInText}>Signed in as: {userEmail}</Text>
          <Text style={styles.streakText}>
            Hydration Streak: 🔥 {hydrationStreak} {hydrationStreak === 1 ? 'Day' : 'Days'}
          </Text>
        </>
      ) : (
        <Button
          mode="contained"
          onPress={signInWithGoogle}
          style={styles.primaryButton}
          labelStyle={styles.primaryLabel}
        >
          Sign in with Google
        </Button>
      )}

      <Button
        mode="contained"
        onPress={() => navigation.navigate('LogMeal')}
        style={styles.primaryButton}
        labelStyle={styles.primaryLabel}
      >
        Log Meal
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('LogWater')}
        style={styles.primaryButton}
        labelStyle={styles.primaryLabel}
      >
        Log Water
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('MealHistory')}
        style={styles.outlinedButton}
        labelStyle={styles.outlinedLabel}
      >
        View Meal History
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('WaterHistory')}
        style={styles.outlinedButton}
        labelStyle={styles.outlinedLabel}
      >
        View Water History
      </Button>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 22,
    fontWeight: '600',
    color: '#4A148C',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    color: '#999',
  },
  signedInText: {
    textAlign: 'center',
    marginBottom: 4,
    color: '#4A148C',
    fontSize: 14,
  },
  streakText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#007aff',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#E1CFFF',
    borderRadius: 24,
    marginVertical: 6,
    elevation: 2,
  },
  primaryLabel: {
    color: '#4A148C',
    fontWeight: 'bold',
  },
  outlinedButton: {
    borderRadius: 24,
    borderColor: '#E1CFFF',
    borderWidth: 1,
    marginVertical: 6,
  },
  outlinedLabel: {
    color: '#4A148C',
  },
});
