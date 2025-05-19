import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import { Timestamp, collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { format } from 'date-fns';
import CalendarModal from '../components/CalendarModal'; // ✅ Import calendar

export default function LogMealScreen() {
  const { user } = useContext(AppContext)!;
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [mealLog, setMealLog] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const fetchMealsForDate = (date: Date) => {
    if (!user) return;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const mealsRef = collection(db, 'users', user.uid, 'meals');
    const q = query(
      mealsRef,
      where('timestamp', '>=', Timestamp.fromDate(startOfDay)),
      where('timestamp', '<=', Timestamp.fromDate(endOfDay))
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meals = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMealLog(meals);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchMealsForDate(selectedDate);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedDate]);

  const handleSaveMeal = async () => {
    if (!user || !mealName.trim()) return;

    const newMeal = {
      name: mealName.trim(),
      type: mealType,
      timestamp: Timestamp.fromDate(selectedDate),
    };

    try {
      const mealsRef = collection(db, 'users', user.uid, 'meals');
      await addDoc(mealsRef, newMeal);
      setMealName('');
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const renderMeal = ({ item }: any) => {
    const mealTime = item.timestamp?.toDate?.();
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.mealText}>
            {item.type}: {item.name}
          </Text>
          {mealTime && (
            <Text style={styles.timestampText}>
              {format(mealTime, 'hh:mm a')}
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Log Your Meal</Text>

      <TouchableOpacity onPress={() => setIsCalendarVisible(true)}>
        <Text style={styles.dateText}>
          {format(selectedDate, 'MMMM dd, yyyy')}
        </Text>
      </TouchableOpacity>

      <TextInput
        label="Meal Description"
        value={mealName}
        onChangeText={setMealName}
        style={styles.input}
        mode="outlined"
      />

      <View style={styles.buttonRow}>
        {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((type) => (
          <Button
            key={type}
            mode={mealType === type ? 'contained' : 'outlined'}
            onPress={() => setMealType(type)}
            style={styles.mealTypeButton}
          >
            {type}
          </Button>
        ))}
      </View>

      <Button mode="contained" onPress={handleSaveMeal} style={styles.saveButton}>
        Save Meal
      </Button>

      <Text style={styles.subheading}>Meals for {format(selectedDate, 'MMM dd')}</Text>

      <FlatList
        data={mealLog}
        keyExtractor={(item) => item.id}
        renderItem={renderMeal}
        contentContainerStyle={styles.mealList}
      />

      {/* ✅ Integrated CalendarModal */}
      <CalendarModal
        visible={isCalendarVisible}
        onClose={() => setIsCalendarVisible(false)}
        onSelectDate={(date) => setSelectedDate(date)}
        selectedDate={selectedDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#007aff',
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  mealTypeButton: {
    margin: 4,
    flexGrow: 1,
  },
  saveButton: {
    marginBottom: 12,
  },
  mealList: {
    paddingBottom: 100,
  },
  card: {
    marginVertical: 6,
    padding: 8,
  },
  mealText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
