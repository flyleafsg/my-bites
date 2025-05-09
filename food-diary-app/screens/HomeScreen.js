import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>What did you eat?</Text>

      <Button
        title="Log Meal"
        onPress={() => navigation.navigate('LogMeal')}
        color="#4CAF50"
      />

      <Button
        title="Track Water Intake"
        onPress={() => navigation.navigate('WaterIntake')}
        color="#2196F3"
      />

      <Text style={styles.subHeader}>View Meal History</Text>

      <Button
        title="Meal History"
        onPress={() => navigation.navigate('MealHistory')}
        color="#9C27B0"
      />

      <Button
        title="Water History"
        onPress={() => navigation.navigate('WaterHistory')}
        color="#9C27B0"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 12,
    textAlign: 'center',
  },
});
