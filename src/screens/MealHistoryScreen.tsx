import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MealHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Meal History Screen</Text>
    </View>
  );
};

export default MealHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});