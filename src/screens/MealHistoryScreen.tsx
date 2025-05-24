import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Text,
  Button,
  Card,
  IconButton,
  Title,
} from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import { db } from '../services/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  query,
} from 'firebase/firestore';
import { auth } from '../services/firebase';

interface MealEntry {
  id: string;
  name: string;
  type: string;
  timestamp?: Timestamp;
}

const MealHistoryScreen = () => {
  const [mealHistory, setMealHistory] = useState<MealEntry[]>([]);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);
  const [editedName, setEditedName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchMeals = async () => {
      try {
        const mealRef = collection(db, 'users', user.uid, 'meals');
        const mealQuery = query(mealRef, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(mealQuery);
        const meals = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MealEntry[];
        setMealHistory(meals);
      } catch (error) {
        console.error('Error fetching meal history:', error);
      }
    };

    fetchMeals();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      if (!user) return;
      await deleteDoc(doc(db, 'users', user.uid, 'meals', id));
      setMealHistory((prev) => prev.filter((meal) => meal.id !== id));
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const handleEdit = (meal: MealEntry) => {
    setEditingMeal(meal);
    setEditedName(meal.name);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!user || !editingMeal) return;
      const mealRef = doc(db, 'users', user.uid, 'meals', editingMeal.id);
      await updateDoc(mealRef, { name: editedName });
      setMealHistory((prev) =>
        prev.map((meal) =>
          meal.id === editingMeal.id ? { ...meal, name: editedName } : meal
        )
      );
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating meal:', error);
    }
  };

  const formatFullDateTime = (timestamp?: Timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isSameDay = (timestamp: Timestamp | undefined, date: Date) => {
    if (!timestamp) return false;
    const entryDate = timestamp.toDate();
    return (
      entryDate.getDate() === date.getDate() &&
      entryDate.getMonth() === date.getMonth() &&
      entryDate.getFullYear() === date.getFullYear()
    );
  };

  const filteredMeals = mealHistory.filter((meal) =>
    isSameDay(meal.timestamp, selectedDate)
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Title>Meal History</Title>
        <IconButton icon="calendar" onPress={() => setShowDatePicker(true)} />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      <FlatList
        data={filteredMeals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.type}</Title>
              <Text>{item.name}</Text>
              <Text style={styles.timestamp}>{formatFullDateTime(item.timestamp)}</Text>
            </Card.Content>
            <Card.Actions>
              <IconButton icon="pencil" onPress={() => handleEdit(item)} />
              <IconButton icon="trash-can" onPress={() => handleDelete(item.id)} />
            </Card.Actions>
          </Card>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Card style={styles.modalCard}>
            <Card.Content>
              <Title>Edit Meal</Title>
              <TextInput
                value={editedName}
                onChangeText={setEditedName}
                style={styles.input}
              />
              <Button onPress={handleSaveEdit}>Save</Button>
              <Button onPress={() => setModalVisible(false)}>Cancel</Button>
            </Card.Content>
          </Card>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  card: {
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalCard: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  timestamp: {
    marginTop: 5,
    fontStyle: 'italic',
    color: 'gray',
  },
});

export default MealHistoryScreen;