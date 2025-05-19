import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Title, Portal, Modal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db, signInWithGoogle } from '../services/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { calculateHydrationStreak } from '../utils/calculateStreak';
import { waterStreakBadges, WaterStreakBadge } from '../constants/waterStreakBadges';

type WaterEntry = {
  timestamp: number | Date;
};

const STORAGE_KEY = 'lastEarnedWaterBadgeId';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hydrationStreak, setHydrationStreak] = useState<number>(0);
  const [earnedBadge, setEarnedBadge] = useState<WaterStreakBadge | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email ?? null);

        const waterRef = collection(db, 'users', user.uid, 'water');
        const q = query(waterRef);

        const unsubscribeFirestore = onSnapshot(q, async (snapshot) => {
          const entries: WaterEntry[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            const rawTimestamp = data.timestamp;
            return {
              timestamp: rawTimestamp?.toDate?.() ?? new Date(rawTimestamp),
            };
          });

          const streak = calculateHydrationStreak(entries);
          setHydrationStreak(streak);

          const badge = [...waterStreakBadges]
            .reverse()
            .find((b) => streak >= b.minStreak) ?? null;

          setEarnedBadge(badge);

          if (badge) {
            const lastBadgeId = await AsyncStorage.getItem(STORAGE_KEY);

            if (lastBadgeId !== badge.id) {
              setShowBadgeModal(true);
              await AsyncStorage.setItem(STORAGE_KEY, badge.id);
            }
          }
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

      {/* 🎉 Badge Unlock Animation Modal */}
      <Portal>
        <Modal visible={showBadgeModal} onDismiss={() => setShowBadgeModal(false)} contentContainerStyle={styles.modalContainer}>
          {earnedBadge && (
            <>
              <Text style={styles.modalEmoji}>{earnedBadge.emoji}</Text>
              <Text style={styles.modalTitle}>Unlocked: {earnedBadge.name}</Text>
              <Text style={styles.modalDescription}>{earnedBadge.description}</Text>
            </>
          )}
        </Modal>
      </Portal>
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 24,
  },
  modalEmoji: {
    fontSize: 64,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A148C',
    marginTop: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});
