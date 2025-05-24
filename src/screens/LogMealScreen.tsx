import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Card, Snackbar, IconButton } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import {
  Timestamp,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { format } from 'date-fns';
import CalendarModal from '../components/CalendarModal';

export default function LogMealScreen() {
  const { user } = useContext(AppContext)!;
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [mealLog, setMealLog] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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

  const fetchFavorites = async () => {
    if (!user) return;
    const favRef = collection(db, 'users', user.uid, 'favorites');
    const snapshot = await getDocs(favRef);
    const favs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('⭐ Fetched Favorites:', favs);
    setFavorites(favs);
  };

  const isFavorite = (meal: any) => {
    return favorites.some(
      (fav) => fav.name === meal.name && fav.type === meal.type
    );
  };

  const handleAddToFavorites = async (meal: any) => {
    if (!user) return;
    try {
      const favRef = collection(db, 'users', user.uid, 'favorites');
      const snapshot = await getDocs(
        query(favRef, where('name', '==', meal.name), where('type', '==', meal.type))
      );
      if (!snapshot.empty) {
        setSnackbarMessage('Already in favorites');
        setSnackbarVisible(true);
        return;
      }
      await addDoc(favRef, {
        name: meal.name,
        type: meal.type,
        timestamp: meal.timestamp || Timestamp.now(),
      });
      setSnackbarMessage(`Added to favorites: ${meal.name} (${meal.type})`);
      setSnackbarVisible(true);
      fetchFavorites();
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = fetchMealsForDate(selectedDate);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedDate]);

  useEffect(() => {
    fetchFavorites();
  }, []);

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
      setSnackbarMessage('Meal saved successfully');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Log Your Meal</Text>

      <TouchableOpacity onPress={() => setIsCalendarVisible(true)}>
        <Text style={styles.dateText}>{format(selectedDate, 'MMMM dd, yyyy')}</Text>
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

      <Text style={styles.subheading}>Favorites</Text>
      <View style={styles.favoritesWrap}>
        {favorites.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.favoriteCard}
            onPress={() => {
              setMealName(item.name);
              setMealType(item.type);
              setSnackbarMessage(`Pre-filled with: ${item.name} (${item.type})`);
              setSnackbarVisible(true);
            }}
          >
            <Text style={styles.favoriteText}>{item.type}: {item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subheading}>Meals for {format(selectedDate, 'MMM dd')}</Text>

      {mealLog.map((item) => {
        const mealTime = item.timestamp?.toDate?.();
        const favorited = isFavorite(item);
        return (
          <Card key={item.id} style={styles.card}>
            <Card.Content style={{ backgroundColor: '#f9f9f9', borderRadius: 8 }}>
              <View style={styles.mealRow}>
                <Text style={[styles.mealText, { color: '#000' }]}> 
                  {item.type}: {item.name}
                </Text>
                <IconButton
                  icon={favorited ? 'star' : 'star-outline'}
                  size={20}
                  onPress={() => handleAddToFavorites(item)}
                  iconColor={favorited ? '#FFD700' : '#888'}
                />
              </View>
              {mealTime && (
                <Text style={[styles.timestampText, { color: '#333' }]}> 
                  {format(mealTime, 'hh:mm a')}
                </Text>
              )}
            </Card.Content>
          </Card>
        );
      })}

      <CalendarModal
        visible={isCalendarVisible}
        onClose={() => setIsCalendarVisible(false)}
        onSelectDate={(date) => setSelectedDate(date)}
        selectedDate={selectedDate}
      />

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
  favoritesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  favoriteCard: {
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 8,
    minWidth: 160,
    marginRight: 8,
    marginBottom: 8,
  },
  favoriteText: {
    fontSize: 14,
    color: '#333',
  },
  mealList: {
    paddingBottom: 100,
  },
  card: {
    marginVertical: 6,
    padding: 0,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealText: {
    fontSize: 16,
    flexShrink: 1,
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
