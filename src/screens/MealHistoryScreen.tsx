import React, { useEffect, useState } from 'react';
import { View, FlatList, Modal, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Card, IconButton } from 'react-native-paper';
import { db } from '../services/firebase';

type MealEntry = {
  id: string;
  name: string;
  type: string;
};

const MealHistoryScreen = () => {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<MealEntry | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedType, setEditedType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchMeals = async () => {
    const snapshot = await db.collection('meals').get();
    const mealData: MealEntry[] = [];
    snapshot.forEach((docSnap) => {
      mealData.push({ id: docSnap.id, ...(docSnap.data() as MealEntry) });
    });
    setMeals(mealData);
  };

  const handleDelete = async (id: string) => {
    await db.collection('meals').doc(id).delete();
    fetchMeals();
  };

  const handleEdit = (meal: MealEntry) => {
    setSelectedMeal(meal);
    setEditedName(meal.name);
    setEditedType(meal.type);
    setIsModalVisible(true);
  };

  const saveEdit = async () => {
    if (selectedMeal) {
      await db.collection('meals').doc(selectedMeal.id).update({
        name: editedName,
        type: editedType,
      });
      setIsModalVisible(false);
      fetchMeals();
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.name} subtitle={item.type} />
            <Card.Actions>
              <IconButton icon="pencil" onPress={() => handleEdit(item)} />
              <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
            </Card.Actions>
          </Card>
        )}
      />

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Edit Meal</Text>
            <TextInput
              label="Name"
              value={editedName}
              onChangeText={setEditedName}
              style={styles.input}
            />
            <TextInput
              label="Type"
              value={editedType}
              onChangeText={setEditedType}
              style={styles.input}
            />
            <Button onPress={saveEdit}>Save</Button>
            <Button onPress={() => setIsModalVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 10,
  },
});

export default MealHistoryScreen;
