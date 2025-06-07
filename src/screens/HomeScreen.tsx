import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebase';

const HomeScreen = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>My Bites Dashboard</Title>

      <Text style={styles.subText}>Signed in as: {user?.email}</Text>

      <View style={styles.buttonContainer}>
        <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('LogMealScreen')}>
          Log Meal
        </Button>

        <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('LogWaterScreen')}>
          Log Water
        </Button>

        <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('MealHistoryScreen')}>
          View Meal History
        </Button>

        <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('WaterHistoryScreen')}>
          View Water History
        </Button>

        <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('BadgeCollectionScreen')}>
          View Badges
        </Button>

        <Button mode="outlined" style={styles.profileButton} onPress={() => navigation.navigate('ProfileScreen')}>
          Edit Profile
        </Button>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 26,
    marginBottom: 24,
    textAlign: 'center',
  },
  subText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    marginBottom: 16,
    borderRadius: 20,
    paddingVertical: 6,
  },
  profileButton: {
    marginTop: 24,
    borderRadius: 20,
  },
});
