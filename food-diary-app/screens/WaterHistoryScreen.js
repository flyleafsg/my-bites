import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WaterHistoryScreen() {
  const [waterEntries, setWaterEntries] = useState([]);

  useEffect(() => {
    loadWaterHistory();
  }, []);

  const loadWaterHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('waterIntake');
      const parsed = stored ? JSON.parse(stored) : [];
      setWaterEntries(parsed);
    } catch (err) {
      console.warn('Error loading water intake history:', err);
    }
  };

  const handleDelete = async (id) => {
    const updated = waterEntries.filter(entry => entry.id !== id);
    setWaterEntries(updated);
    await AsyncStorage.setItem('waterIntake', JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Water Intake History</Text>
      {waterEntries.length === 0 ? (
        <Text style={styles.empty}>No water intake entries yet.</Text>
      ) : (
        <FlatList
          data={waterEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>
                {item.amount} oz at {item.timestamp}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
    marginVertical: 4,
  },
  itemText: { fontSize: 16 },
  delete: { fontSize: 18, color: 'red' },
});
