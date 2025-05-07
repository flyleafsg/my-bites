import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

const HomeScreen = () => {
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽️ Meals</Text>
          {/* TODO: Render MealCard components here */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💧 Water Tracker</Text>
          {/* TODO: Add WaterTracker component here */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Favorite Foods</Text>
          {/* TODO: Add FavoritesPreview component here */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Streak: 3 days in a row!</Text>
          {/* Gamified element preview */}
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
