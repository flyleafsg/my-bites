import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { format } from 'date-fns';
import CalendarModal from '../components/CalendarModal';

export default function MealHistoryScreen() {
  const { user } = useContext(AppContext)!;
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

  const renderMeal = ({ item }: any) => {
    const mealTime = item.timestamp?.toDate?.();
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.mealText}>{item.type}: {item.name}</Text>
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
      <Text style={styles.heading}>Meal History</Text>

      <TouchableOpacity onPress={() => setIsCalendarVisible(true)}>
        <Text style={styles.dateText}>
          {format(selectedDate, 'MMMM dd, yyyy')}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={mealLog}
        keyExtractor={(item) => item.id}
        renderItem={renderMeal}
        contentContainerStyle={styles.listContainer}
      />

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
  dateText: {
    fontSize: 16,
    color: '#007aff',
    textAlign: 'center',
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 100,
  },
  card: {
    marginBottom: 10,
    padding: 10,
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
