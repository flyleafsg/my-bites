import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MealCard from '../components/MealCard';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleMealPress = (mealType) => {
    navigation.navigate('LogMeal', { mealType });
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.greeting}>Welcome back! 👋</Text>
        <Text style={styles.date}>{today}</Text>

        {/* Meals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽️ Meals</Text>
          <MealCard title="Breakfast" emoji="🍳" onPress={() => handleMealPress('Breakfast')} />
          <MealCard title="Lunch" emoji="🥗" onPress={() => handleMealPress('Lunch')} />
          <MealCard title="Dinner" emoji="🍝" onPress={() => handleMealPress('Dinner')} />
          <MealCard title="Snacks" emoji="🍪" onPress={() => handleMealPress('Snacks')} />
        </View>

        {/* Water Tracker Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💧 Water Tracker</Text>
        </View>

        {/* Favorite Foods Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Favorite Foods</Text>
        </View>

        {/* Gamification Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Streak: 3 days in a row!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
});

export default HomeScreen;
