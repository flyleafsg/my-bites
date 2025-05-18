import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth, signInWithGoogle } from '../services/firebase';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserEmail(user?.email ?? null);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Meal Diary Dashboard</Title>
      <Text style={styles.subtitle}>Welcome to Meal Diary</Text>

      {userEmail ? (
        <Text style={styles.signedInText}>Signed in as: {userEmail}</Text>
      ) : (
        <Button
          mode="contained"
          onPress={signInWithGoogle}
          style={styles.primaryButton}
          labelStyle={styles.primaryLabel}
        >
          Sign in with Google
        </Button>
      )}

      <Button
        mode="contained"
        onPress={() => navigation.navigate('LogMeal')}
        style={styles.primaryButton}
        labelStyle={styles.primaryLabel}
      >
        Log Meal
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('LogWater')}
        style={styles.primaryButton}
        labelStyle={styles.primaryLabel}
      >
        Log Water
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('MealHistory')}
        style={styles.outlinedButton}
        labelStyle={styles.outlinedLabel}
      >
        View Meal History
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('WaterHistory')}
        style={styles.outlinedButton}
        labelStyle={styles.outlinedLabel}
      >
        View Water History
      </Button>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', // ✅ white background
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 22,
    fontWeight: '600',
    color: '#4A148C',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#999',
  },
  signedInText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#4A148C',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#E1CFFF', // ✅ matched from your screenshot
    borderRadius: 24,
    marginVertical: 6,
    elevation: 2,
  },
  primaryLabel: {
    color: '#4A148C',
    fontWeight: 'bold',
  },
  outlinedButton: {
    borderRadius: 24,
    borderColor: '#E1CFFF',
    borderWidth: 1,
    marginVertical: 6,
  },
  outlinedLabel: {
    color: '#4A148C',
  },
});
