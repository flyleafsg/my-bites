import React, { useEffect, useState } from 'react';
import { View, FlatList, Modal, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Card, IconButton } from 'react-native-paper';
import { db } from '../services/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

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

  // Fetch meals from Firestore
  const fetchMeals = async () => {
    const querySnapshot = await getDocs(collection(db, 'meals'));
    const mealData: MealEntry[] = [];
    querySnapshot.forEach((docSnap) => {
      mealData.push({ id: docSnap.id, ...(docSnap.data() as Omit<MealEntry, 'id'>) });
    });
    setMeals(mealData);
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'meals', id));
    fetchMeals();
  };

  const handleEdit = (meal: MealEntry) => {
    setSelectedMeal(meal);
    setEditedName(meal.name);
    setEditedType(meal.type);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (selectedMeal) {
      await updateDoc(doc(db, 'meals', selectedMeal.id), {
        name: editedName,
        type: editedType,
      });
      setIsModalVisible(false);
      setSelectedMeal(null);
      fetchMeals();
    }
  };

  const renderMealItem = ({ item }: { item: MealEntry }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`${item.type}`}
        subtitle={item.name}
        right={() => (
          <View style={styles.iconContainer}>
            <IconButton
              icon="pencil"
              onPress={() => handleEdit(item)}
              accessibilityLabel="Edit Meal"
            />
            <IconButton
              icon="delete"
              onPress={() => handleDelete(item.id)}
              accessibilityLabel="Delete Meal"
            />
          </View>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={renderMealItem}
        contentContainerStyle={styles.list}
      />

      {/* Edit Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text>Edit Meal</Text>
            <TextInput
              label="Meal Name"
              value={editedName}
              onChangeText={setEditedName}
              style={styles.input}
            />
            <TextInput
              label="Meal Type"
              value={editedType}
              onChangeText={setEditedType}
              style={styles.input}
            />
            <Button mode="contained" onPress={handleSaveEdit} style={styles.button}>
              Save
            </Button>
            <Button onPress={() => setIsModalVisible(false)} style={styles.button}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MealHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 8,
  },
});
