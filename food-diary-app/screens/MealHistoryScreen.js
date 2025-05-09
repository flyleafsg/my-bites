import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MealHistoryScreen() {
  const [mealData, setMealData] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  useEffect(() => {
    loadMealHistory();
  }, []);

  const loadMealHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('mealsByCategory');
      if (stored) {
        const parsed = JSON.parse(stored);
        setMealData({
          breakfast: parsed.breakfast || [],
          lunch: parsed.lunch || [],
          dinner: parsed.dinner || [],
          snacks: parsed.snacks || [],
        });
      }
    } catch (err) {
      console.warn('Error loading meal history:', err);
    }
  };

  const handleDelete = async (category, id) => {
    const updatedCategory = mealData[category].filter(item => item.id !== id);
    const updatedData = {
      ...mealData,
      [category]: updatedCategory,
    };
    setMealData(updatedData);
    await AsyncStorage.setItem('mealsByCategory', JSON.stringify(updatedData));
  };

  const renderMealSection = (title, dataKey) => {
    const data = mealData[dataKey];
    if (!data || data.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>{item.text}</Text>
              <TouchableOpacity onPress={() => handleDelete(dataKey, item.id)}>
                <Text style={styles.delete}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meal History</Text>
      {renderMealSection('Breakfast', 'breakfast')}
      {renderMealSection('Lunch', 'lunch')}
      {renderMealSection('Dinner', 'dinner')}
      {renderMealSection('Snacks', 'snacks')}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    marginVertical: 4,
  },
  itemText: { fontSize: 16 },
  delete: { fontSize: 18, color: 'red' },
});
