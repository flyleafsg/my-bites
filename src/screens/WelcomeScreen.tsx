import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('Profile' as never);
  };

  const handleSkip = () => {
    navigation.navigate('Profile' as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to My Bites!</Text>
      <Text style={styles.subtitle}>Track your meals, hydration, and earn badges.</Text>
      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={handleSkip}>Skip</Button>
        <Button mode="contained" onPress={handleNext} style={styles.nextButton}>Next</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 40 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '80%' },
  nextButton: { marginLeft: 10 },
});

export default WelcomeScreen;
