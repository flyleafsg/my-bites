import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<Navigation>();

  // Placeholder: future onboarding logic can go here

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Welcome to Meal Diary 👋</Title>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('LogMeal')}
          >
            Log a Meal
          </Button>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('LogWater')}
          >
            Log Water Intake
          </Button>

          <Button
            mode="outlined"
            style={styles.button}
            onPress={() => navigation.navigate('MealHistory')}
          >
            View Meal History
          </Button>

          <Button
            mode="outlined"
            style={styles.button}
            onPress={() => navigation.navigate('WaterHistory')}
          >
            View Water History
          </Button>

          <View style={styles.summary}>
            <Text style={styles.summaryText}>Today’s Summary</Text>
            <Text style={styles.placeholder}>🧠 Motivation stats coming soon!</Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginVertical: 6,
  },
  summary: {
    marginTop: 24,
    alignItems: 'center',
  },
  summaryText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  placeholder: {
    fontSize: 12,
    color: 'gray',
  },
});
