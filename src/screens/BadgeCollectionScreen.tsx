import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';
import { waterStreakBadges, WaterStreakBadge } from '../constants/waterStreakBadges';
import { calculateHydrationStreak } from '../utils/calculateStreak';
import { db, auth } from '../services/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { WaterEntry } from '../types/types';

const BadgeCollectionScreen = () => {
  const [hydrationStreak, setHydrationStreak] = useState<number>(0);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const waterRef = collection(db, 'users', user.uid, 'water');
        const q = query(waterRef);

        const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
          const entries: WaterEntry[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp?.toDate?.() ?? new Date(data.timestamp);
            const amount = Number(data.amount ?? data.ounces);
            return { id: doc.id, timestamp, amount };
          });

          const streak = calculateHydrationStreak(entries);
          setHydrationStreak(streak);
        });

        return () => unsubscribeFirestore();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const renderBadge = ({ item }: { item: WaterStreakBadge }) => {
    const unlocked = hydrationStreak >= item.minStreak;

    return (
      <Card style={[styles.card, !unlocked && styles.lockedCard]}>
        <Card.Content style={styles.cardContent}>
          <Text style={[styles.emoji, !unlocked && styles.lockedText]}>{item.emoji}</Text>
          <Title style={[styles.badgeTitle, !unlocked && styles.lockedText]}>
            {item.name}
          </Title>
          <Text style={[styles.badgeDescription, !unlocked && styles.lockedText]}>
            {item.description}
          </Text>
          {!unlocked && <Text style={styles.lockedLabel}>Locked</Text>}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Title style={styles.screenTitle}>Your Hydration Badges</Title>
      <FlatList
        data={waterStreakBadges}
        keyExtractor={(item) => item.id}
        renderItem={renderBadge}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default BadgeCollectionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  screenTitle: { fontSize: 20, fontWeight: 'bold', color: '#4A148C', marginBottom: 12, textAlign: 'center' },
  list: { paddingBottom: 16 },
  card: { marginBottom: 12, borderRadius: 12, elevation: 2 },
  lockedCard: { backgroundColor: '#f0f0f0' },
  cardContent: { alignItems: 'center' },
  emoji: { fontSize: 48 },
  badgeTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A148C', marginTop: 4 },
  badgeDescription: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 4 },
  lockedText: { opacity: 0.4 },
  lockedLabel: { marginTop: 6, fontSize: 12, color: '#888', fontStyle: 'italic' },
});
