import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  IconButton,
  Title,
  Snackbar,
} from 'react-native-paper';
import { auth, db } from '../services/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  query,
  where,
  addDoc,
} from 'firebase/firestore';

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
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [favorites, setFavorites] = useState<any[]>([]);
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

    const fetchFavorites = async () => {
      const favRef = collection(db, 'users', user.uid, 'favorites');
      const snapshot = await getDocs(favRef);
      const favs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(favs);
    };

    fetchMeals();
    fetchFavorites();
  }, [user]);

  const isFavorite = (meal: MealEntry) => {
    return favorites.some(
      (fav) => fav.name === meal.name && fav.type === meal.type
    );
  };

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

  const handleAddFavorite = async (meal: MealEntry) => {
    try {
      if (!user) return;
      const favoritesRef = collection(db, 'users', user.uid, 'favorites');
      const q = query(
        favoritesRef,
        where('name', '==', meal.name),
        where('type', '==', meal.type)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setSnackbarMessage('Already in favorites!');
        setSnackbarVisible(true);
        return;
      }

      await addDoc(favoritesRef, {
        name: meal.name,
        type: meal.type,
        timestamp: meal.timestamp || Timestamp.now(),
      });

      setSnackbarMessage('Added to favorites!');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error adding to favorites:', error);
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

  return (
    <View style={styles.container}>
      <FlatList
        data={mealHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.mealRow}>
                <Text style={styles.mealText}>{item.type}: {item.name}</Text>
                <IconButton
                  icon={isFavorite(item) ? 'star' : 'star-outline'}
                  onPress={() => handleAddFavorite(item)}
                  iconColor={isFavorite(item) ? '#FFD700' : '#888'}
                />
              </View>
              <Text style={styles.timestamp}>{formatFullDateTime(item.timestamp)}</Text>
            </Card.Content>
            <Card.Actions>
              <IconButton icon="pencil" onPress={() => handleEdit(item)} />
              <IconButton icon="trash-can" onPress={() => handleDelete(item.id)} />
            </Card.Actions>
          </Card>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
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

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: '#4caf50' }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardContent: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealText: {
    fontSize: 16,
    color: '#000',
    flexShrink: 1,
  },
  timestamp: {
    marginTop: 5,
    fontStyle: 'italic',
    color: '#333',
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
});

export default MealHistoryScreen;