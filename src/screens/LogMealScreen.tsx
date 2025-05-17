import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Text, TextInput, Button, Card, IconButton } from 'react-native-paper';
import { db } from '../services/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';

type MealEntry = {
  id: string;
  name: string;
  type: string;
};

const LogMealScreen = () => {
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('');
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<MealEntry | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedType, setEditedType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleAddMeal = async () => {
    if (mealName.trim() === '' || mealType.trim() === '') return;

    await addDoc(collection(db, 'meals'), {
      name: mealName,
      type: mealType,
    });

    setMealName('');
    setMealType('');
    fetchMeals();
  };

  const confirmDelete = (id: string) => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('Are you sure you want to delete this?');
      if (confirm) handleDelete(id);
    } else {
      Alert.alert(
        'Delete Meal',
        'Are you sure you want to delete this?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
        ],
        { cancelable: true }
      );
    }
  };

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
        title={item.type || 'Unspecified'}
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
              onPress={() => confirmDelete(item.id)}
              accessibilityLabel="Delete Meal"
            />
          </View>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <TextInput
        label="Meal Name"
        value={mealName}
        onChangeText={setMealName}
        style={styles.input}
      />
      <TextInput
        label="Meal Type"
        value={mealType}
        onChangeText={setMealType}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleAddMeal} style={styles.button}>
        Save Meal
      </Button>

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
              Save Changes
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

export default LogMealScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginVertical: 8,
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
});
