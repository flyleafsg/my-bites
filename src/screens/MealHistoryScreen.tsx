import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { db } from '../services/firebase';
import { MealEntry } from '../context/AppContext';

const MealHistoryScreen = () => {
  const [meals, setMeals] = useState<MealEntry[]>([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const snapshot = await db.collection('meals').orderBy('timestamp', 'desc').get();
        const raw = snapshot.docs.map((doc) => {
          const data = doc.data();
          if (data.name && data.type) {
            return {
              id: doc.id,
              name: data.name,
              type: data.type,
              timestamp: data.timestamp,
            };
          }
          return null;
        });

        const fetchedMeals: MealEntry[] = raw.filter((m): m is MealEntry => m !== null);
        setMeals(fetchedMeals);
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Meal History</Text>
      <FlatList
        data={meals}
        keyExtractor={(item, index) => `${item.name}-${item.timestamp ?? index}`}
        renderItem={({ item }) => (
          <Text style={styles.item}>• {item.name} ({item.type})</Text>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No meals logged yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#3A2D60',
  },
  item: {
    fontSize: 16,
    marginBottom: 10,
    color: '#5A3E85',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
  },
});

export default MealHistoryScreen;
