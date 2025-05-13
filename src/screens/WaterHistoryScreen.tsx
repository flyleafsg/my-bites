 import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WaterHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Water History Screen</Text>
    </View>
  );
};

export default WaterHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
