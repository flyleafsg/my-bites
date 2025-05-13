import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Snackbar,
  Divider,
  HelperText,
} from 'react-native-paper';
import { db } from '../services/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const LogMealScreen = () => {
  const [foodItem, setFoodItem] = useState('');
  const [mealItems, setMealItems] = useState<string[]>([]);
  const [mealType, setMealType] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const addFoodItem = () => {
    if (foodItem.trim()) {
      setMealItems((prev) => [...prev, foodItem.trim()]);
      setFoodItem('');
    }
  };

  const handleSaveMeal = async () => {
    if (mealItems.length === 0 || !mealType) {
      setShowError(true);
      return;
    }

    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'meals'), {
        items: mealItems,
        mealType,
        timestamp: serverTimestamp(),
      });
      console.log('✅ Meal saved with ID:', docRef.id);
      setMealItems([]);
      setMealType('');
      setShowSuccess(true);
    } catch (error) {
      console.error('❌ Error saving meal:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <Text style={styles.sectionLabel}>Add Food Items</Text>
          <View style={styles.row}>
            <TextInput
              mode="outlined"
              label="Enter a food item"
              value={foodItem}
              onChangeText={setFoodItem}
              style={styles.input}
            />
            <Button mode="contained" onPress={addFoodItem} style={styles.addButton}>
              Add
            </Button>
          </View>

          {mealItems.length > 0 && (
            <View style={styles.mealList}>
              <Text style={styles.sectionLabel}>Items in this meal</Text>
              <FlatList
                data={mealItems}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item }) => (
                  <Text style={styles.item}>• {item}</Text>
                )}
              />
            </View>
          )}

          <Divider style={{ marginVertical: 24 }} />

          <Text style={styles.sectionLabel}>Select Meal Type</Text>
          <View style={styles.buttonGrid}>
            {mealTypes.map((type) => (
              <Button
                key={type}
                mode={mealType === type ? 'contained' : 'outlined'}
                onPress={() => setMealType(type)}
                style={[
                  styles.mealTypeButton,
                  mealType === type && styles.selectedMealButton,
                ]}
              >
                {type}
              </Button>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={handleSaveMeal}
            loading={saving}
            disabled={saving}
            style={styles.saveButton}
          >
            Save Meal
          </Button>

          <HelperText type="error" visible={showError}>
            Please add food items and select a meal type.
          </HelperText>
        </KeyboardAvoidingView>
      </ScrollView>

      <Snackbar
        visible={showSuccess}
        onDismiss={() => setShowSuccess(false)}
        duration={3000}
      >
        ✅ Meal saved to Firestore!
      </Snackbar>
    </SafeAreaView>
  );
};

export default LogMealScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    height: 56,
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  mealList: {
    marginBottom: 24,
  },
  item: {
    fontSize: 14,
    marginVertical: 2,
    marginLeft: 8,
    color: '#444',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  mealTypeButton: {
    flexBasis: '48%',
    marginBottom: 12,
    height: 48,
    justifyContent: 'center',
  },
  selectedMealButton: {
    borderWidth: 2,
    borderColor: '#9370DB',
  },
  saveButton: {
    marginTop: 12,
    borderRadius: 24,
    paddingVertical: 8,
  },
});
