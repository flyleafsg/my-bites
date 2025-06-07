import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Text, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../services/firebase';  // ✅ assumes you're using your modular firebase service
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [hydrationTarget, setHydrationTarget] = useState('64');
  const [loading, setLoading] = useState(false);

  const handleOnboardingComplete = async () => {
    if (!user) {
      Alert.alert('User not authenticated.');
      return;
    }

    if (name.trim() === '' || hydrationTarget.trim() === '') {
      Alert.alert('Please complete all fields.');
      return;
    }

    try {
      setLoading(true);

      const profileRef = doc(db, 'users', user.uid, 'profile');
      await setDoc(profileRef, {
        name: name.trim(),
        hydrationTarget: parseInt(hydrationTarget),
        createdAt: new Date(),
      });

      await AsyncStorage.setItem('hasOnboarded', 'true');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Welcome to My Bites!</Title>
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Daily hydration target (oz)"
        value={hydrationTarget}
        onChangeText={setHydrationTarget}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleOnboardingComplete}
        loading={loading}
        style={styles.button}
      >
        Complete Setup
      </Button>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'white',
  },
  title: {
    marginBottom: 24,
    fontSize: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  button: {
    marginTop: 16,
  },
});
