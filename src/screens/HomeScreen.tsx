import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to MyBites!</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Button mode="contained" onPress={() => navigation.navigate('LogMeal')} style={styles.button}>
            Log Meal
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate('LogWater')} style={styles.button}>
            Log Water
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate('MealHistory')} style={styles.button}>
            View Meal History
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate('WaterHistory')} style={styles.button}>
            View Water History
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.summaryText}>Today's Summary coming soon...</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
 heading: {
  fontSize: 28,
  fontWeight: '700',
  color: '#333', // dark grey for contrast
  marginBottom: 20,
  textAlign: 'center',
},

  card: {
    marginBottom: 20,
  },
  button: {
    marginVertical: 6,
  },
  summaryCard: {
    marginTop: 20,
  },
  summaryText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});
