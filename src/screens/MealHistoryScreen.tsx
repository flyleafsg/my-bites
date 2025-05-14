import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import { MealEntry } from '../context/AppContext';

const MealHistoryScreen = () => {
  const { mealLog } = useAppContext();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Meal History</Text>
      <FlatList
        data={mealLog}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }: { item: MealEntry }) => (
          <Text style={styles.item}>• {item.name} ({item.type})</Text>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No meals logged yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#3A2D60',
  },
  item: {
    fontSize: 16,
    marginBottom: 10,
    color: '#5A3E85',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
  },
});

export default MealHistoryScreen;
