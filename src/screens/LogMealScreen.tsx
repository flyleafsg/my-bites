import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

const LogMealScreen = () => {
  const [meal, setMeal] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveMeal = async () => {
    if (!meal.trim()) return;

    setSaving(true);
    try {
      await addDoc(collection(db, 'meals'), {
        description: meal.trim(),
        timestamp: serverTimestamp(),
      });
      setMeal('');
      setShowSuccess(true);
    } catch (error) {
      console.error('Error saving meal:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <Text style={styles.label}>What did you eat?</Text>
        <TextInput
          mode="outlined"
          label="Meal description"
          placeholder="e.g. Eggs, Toast, and Juice"
          value={meal}
          onChangeText={setMeal}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSaveMeal}
          loading={saving}
          disabled={saving || !meal.trim()}
          style={styles.button}
        >
          Save Meal
        </Button>
      </KeyboardAvoidingView>

      <Snackbar
        visible={showSuccess}
        onDismiss={() => setShowSuccess(false)}
        duration={3000}
      >
        ✅ Meal saved successfully!
      </Snackbar>
    </SafeAreaView>
  );
};

export default LogMealScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
