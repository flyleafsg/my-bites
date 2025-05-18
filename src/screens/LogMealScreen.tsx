import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  IconButton,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { db } from '../services/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const LogMealScreen = () => {
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('');
  const [meals, setMeals] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedType, setEditedType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, [selectedDate]);

  const fetchMeals = async () => {
    const snapshot = await getDocs(collection(db, 'meals'));
    const allMeals = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    const filtered = allMeals.filter((meal: any) => {
      const date = meal.timestamp?.toDate?.();
      return date instanceof Date && date.toDateString() === selectedDate.toDateString();
    });
    setMeals(filtered);
  };

  const handleAddMeal = async () => {
    if (mealName.trim() === '' || mealType.trim() === '') return;

    await addDoc(collection(db, 'meals'), {
      name: mealName,
      type: mealType,
      timestamp: Timestamp.now(),
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
      Alert.alert('Delete Meal', 'Are you sure you want to delete this?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
      ]);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'meals', id));
    fetchMeals();
  };

  const handleEdit = (meal: any) => {
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

  const renderMealItem = ({ item }: { item: any }) => {
    const time = item.timestamp?.toDate?.();
    return (
      <Card style={styles.card}>
        <Card.Title
          title={item.type || 'Unspecified'}
          subtitle={`${item.name}  •  ${time instanceof Date ? format(time, 'p') : ''}`}
          right={() => (
            <View style={styles.iconContainer}>
              <IconButton icon="pencil" onPress={() => handleEdit(item)} />
              <IconButton icon="delete" onPress={() => confirmDelete(item.id)} />
            </View>
          )}
        />
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Button onPress={() => setShowDatePicker(true)} mode="outlined" style={styles.dateButton}>
        {format(selectedDate, 'PPP')}
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="calendar"
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      <TextInput
        label="Meal Name"
        value={mealName}
        onChangeText={setMealName}
        style={styles.input}
      />

      <View style={styles.mealTypeRow}>
        {mealTypes.map((type) => (
          <Button
            key={type}
            mode={mealType === type ? 'contained' : 'outlined'}
            onPress={() => setMealType(type)}
            style={[styles.mealTypeButton, mealType === type && styles.selectedMealTypeButton]}
            labelStyle={styles.mealTypeLabel}
          >
            {type}
          </Button>
        ))}
      </View>

      <Button mode="contained" onPress={handleAddMeal} style={styles.saveButton}>
        Save Meal
      </Button>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={renderMealItem}
        contentContainerStyle={styles.list}
      />

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
            <View style={styles.mealTypeRow}>
              {mealTypes.map((type) => (
                <Button
                  key={type}
                  mode={editedType === type ? 'contained' : 'outlined'}
                  onPress={() => setEditedType(type)}
                  style={[styles.mealTypeButton, editedType === type && styles.selectedMealTypeButton]}
                  labelStyle={styles.mealTypeLabel}
                >
                  {type}
                </Button>
              ))}
            </View>
            <Button mode="contained" onPress={handleSaveEdit} style={styles.saveButton}>
              Save Changes
            </Button>
            <Button onPress={() => setIsModalVisible(false)} style={styles.saveButton}>
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
    padding: 12,
  },
  input: {
    marginBottom: 10,
    fontSize: 14,
  },
  mealTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  mealTypeButton: {
    margin: 4,
    borderRadius: 20,
    borderColor: '#E1CFFF',
  },
  selectedMealTypeButton: {
    backgroundColor: '#E1CFFF',
  },
  mealTypeLabel: {
    color: '#4A148C',
    fontSize: 13,
  },
  saveButton: {
    marginVertical: 8,
    backgroundColor: '#E1CFFF',
    borderRadius: 24,
  },
  dateButton: {
    marginBottom: 12,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#1E1E1E',
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
