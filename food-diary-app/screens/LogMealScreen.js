import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function LogMealScreen({ navigation }) {
  const [mealItem, setMealItem] = useState('');
  const [mealType, setMealType] = useState('dinner');
  const [mealData, setMealData] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
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
      console.warn('Failed to load categorized meals:', err);
    }
  };

  const saveMeals = async (updatedData) => {
    try {
      await AsyncStorage.setItem('mealsByCategory', JSON.stringify(updatedData));
    } catch (err) {
      console.error('Failed to save categorized meals:', err);
    }
  };

  const handleAddMeal = () => {
    if (mealItem.trim() === '') return;
    const newMeal = { id: Date.now().toString(), text: mealItem };

    const updatedCategory = [...mealData[mealType], newMeal];
    const updatedData = {
      ...mealData,
      [mealType]: updatedCategory,
    };

    setMealData(updatedData);
    saveMeals(updatedData);
    setMealItem('');
  };

  const handleDelete = (id) => {
    const updatedCategory = mealData[mealType].filter(item => item.id !== id);
    const updatedData = {
      ...mealData,
      [mealType]: updatedCategory,
    };
    setMealData(updatedData);
    saveMeals(updatedData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log Your Meal</Text>

      <Picker
        selectedValue={mealType}
        style={styles.picker}
        onValueChange={(itemValue) => setMealType(itemValue)}
      >
        <Picker.Item label="Breakfast" value="breakfast" />
        <Picker.Item label="Lunch" value="lunch" />
        <Picker.Item label="Dinner" value="dinner" />
        <Picker.Item label="Snacks" value="snacks" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder={`e.g. eggs, toast, salad...`}
        value={mealItem}
        onChangeText={setMealItem}
      />
      <Button title="Add Meal Item" onPress={handleAddMeal} />

      <FlatList
        data={mealData[mealType]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>{item.text}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.delete}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="View Meal History" onPress={() => navigation.navigate('MealHistory')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  picker: {
    height: 50,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
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
