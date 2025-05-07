import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LogMealScreen = ({ route }) => {
  const { mealType } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log your {mealType}</Text>
      {/* TODO: Add meal input, notes, food picker, etc. */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default LogMealScreen;
