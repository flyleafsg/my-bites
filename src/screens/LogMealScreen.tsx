import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LogMealScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Log Meal Screen</Text>
    </View>
  );
};
 
export default LogMealScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});