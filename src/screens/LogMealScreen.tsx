import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

interface MealEntry {
  name: string;
  type: string;
}

const LogMealScreen = () => {
  const { mealLog, addMealItem } = useAppContext();
  const [foodItem, setFoodItem] = useState('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');

  const handleAddItem = () => {
    if (foodItem.trim() !== '') {
      const newEntry: MealEntry = {
        name: foodItem.trim(),
        type: mealType,
      };
      addMealItem(newEntry);
      setFoodItem('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Food Items</Text>

      <View style={styles.mealTypeRow}>
        {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.mealTypeButton,
              mealType === type && styles.mealTypeButtonSelected,
            ]}
            onPress={() => setMealType(type as any)}
          >
            <Text
              style={[
                styles.mealTypeText,
                mealType === type && styles.mealTypeTextSelected,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Enter a food item"
          value={foodItem}
          onChangeText={setFoodItem}
          mode="flat"
          style={styles.input}
          placeholderTextColor="#ccc"
        />
        <Button mode="contained" onPress={handleAddItem} style={styles.addButton}>
          Add
        </Button>
      </View>

      <Text style={styles.subheading}>Items in this meal</Text>
      <FlatList
        data={mealLog}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }: { item: MealEntry }) => (
          <Text style={styles.itemText}>• {item.name} ({item.type})</Text>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No items added yet.</Text>}
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3A2D60',
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#3A2D60',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    marginRight: 10,
    color: '#fff',
  },
  addButton: {
    borderRadius: 12,
    backgroundColor: '#d5bfff',
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#5A3E85',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
  },
  mealTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  mealTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  mealTypeButtonSelected: {
    backgroundColor: '#d5bfff',
    borderColor: '#5A3E85',
  },
  mealTypeText: {
    color: '#555',
    fontWeight: 'bold',
  },
  mealTypeTextSelected: {
    color: '#3A2D60',
  },
});

export default LogMealScreen;