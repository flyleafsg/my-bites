import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth, db, signInWithGoogle } from '../services/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { calculateHydrationStreak } from '../utils/calculateStreak';
import { waterStreakBadges, WaterStreakBadge } from '../constants/waterStreakBadges';

type WaterEntry = {
  timestamp: number | Date;
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hydrationStreak, setHydrationStreak] = useState<number>(0);
  const [earnedBadge, setEarnedBadge] = useState<WaterStreakBadge | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email ?? null);

        const waterRef = collection(db, 'users', user.uid, 'water');
        const q = query(waterRef);

       const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
  const entries: WaterEntry[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    console.log('🔥 Water log raw data:', data);
    const rawTimestamp = data.timestamp;
    return {
      timestamp: rawTimestamp?.toDate?.() ?? new Date(rawTimestamp),
    };
  });

  console.log('💧 Parsed entries:', entries);

  const streak = calculateHydrationStreak(entries);
  console.log('💧 Hydration Streak:', streak);
  setHydrationStreak(streak);

  const badge = [...waterStreakBadges]
    .reverse()
    .find((b) => streak >= b.minStreak) ?? null;

  console.log('🏅 Earned Badge:', badge);
  setEarnedBadge(badge);
});



        return () => unsubscribeFirestore();
      } else {
        setUserEmail(null);
        setHydrationStreak(0);
        setEarnedBadge(null);
      }
    });

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

          {/* ✅ Force render test badge for visual check */}
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeEmoji}>💧</Text>
            <Text style={styles.badgeName}>Test Badge</Text>
            <Text style={styles.badgeDescription}>This is just a test to check rendering.</Text>
          </View>

          {/* 🧪 Real badge rendering */}
          {earnedBadge && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeEmoji}>{earnedBadge.emoji}</Text>
              <Text style={styles.badgeName}>{earnedBadge.name}</Text>
              <Text style={styles.badgeDescription}>{earnedBadge.description}</Text>
            </View>
          )}
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
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeEmoji: {
    fontSize: 48,
  },
  badgeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A148C',
    marginTop: 4,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 16,
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
