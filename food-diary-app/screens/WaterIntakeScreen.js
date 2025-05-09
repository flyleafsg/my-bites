import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WaterIntakeScreen() {
  const [ounces, setOunces] = useState(0);
  const [waterEntries, setWaterEntries] = useState([]);
  const [groupedEntries, setGroupedEntries] = useState({});
  const [todayTotal, setTodayTotal] = useState(0);

  useEffect(() => {
    loadWaterData();
  }, []);

  const loadWaterData = async () => {
    try {
      const stored = await AsyncStorage.getItem('waterIntake');
      let parsed = [];
      try {
        parsed = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(parsed)) parsed = [];
      } catch (parseErr) {
        console.warn('Error parsing water data:', parseErr);
        parsed = [];
      }

      setWaterEntries(parsed);
      groupByDate(parsed);
      calculateTodayTotal(parsed);
    } catch (err) {
      console.warn('Failed to load water data:', err);
      setWaterEntries([]);
    }
  };

  const saveWaterData = async (entries) => {
    try {
      await AsyncStorage.setItem('waterIntake', JSON.stringify(entries));
    } catch (err) {
      console.error('Failed to save water data:', err);
    }
  };

  const getDateKey = (dateObj) => {
    return dateObj.toLocaleDateString(); // e.g., "5/9/2025"
  };

  const groupByDate = (entries) => {
    const grouped = {};
    entries.forEach((entry) => {
      const dateKey = getDateKey(new Date(entry.timestamp));
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(entry);
    });
    setGroupedEntries(grouped);
  };

  const calculateTodayTotal = (entries) => {
    const today = getDateKey(new Date());
    const total = entries
      .filter(entry => getDateKey(new Date(entry.timestamp)) === today)
      .reduce((sum, entry) => sum + entry.amount, 0);
    setTodayTotal(total);
  };

  const handleAddWater = () => {
    if (ounces <= 0) return;
    const newEntry = {
      id: Date.now().toString(),
      amount: ounces,
      timestamp: new Date().toISOString()
    };
    const updated = [...waterEntries, newEntry];
    setWaterEntries(updated);
    setOunces(0);
    saveWaterData(updated);
    groupByDate(updated);
    calculateTodayTotal(updated);
  };

  const handleDelete = (id) => {
    const updated = waterEntries.filter(entry => entry.id !== id);
    setWaterEntries(updated);
    saveWaterData(updated);
    groupByDate(updated);
    calculateTodayTotal(updated);
  };

  const increment = () => setOunces(ounces + 8);
  const decrement = () => setOunces(Math.max(0, ounces - 8));

  const renderGroupedEntries = () => {
    const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
      return new Date(b) - new Date(a);
    });

    return sortedDates.map((dateKey) => (
      <View key={dateKey} style={styles.groupSection}>
        <Text style={styles.groupHeader}>
          {getDateKey(new Date()) === dateKey ? 'Today' : dateKey}
        </Text>
        {groupedEntries[dateKey].map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemText}>
              {item.amount} oz at {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.delete}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Track Water Intake</Text>
      <Text style={styles.subheader}>Total Today: {todayTotal} oz</Text>

      <View style={styles.ounceControl}>
        <TouchableOpacity onPress={decrement} style={styles.adjustBtn}>
          <Text style={styles.adjustText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.ounceText}>{ounces} oz</Text>
        <TouchableOpacity onPress={increment} style={styles.adjustBtn}>
          <Text style={styles.adjustText}>+</Text>
        </TouchableOpacity>
      </View>

      <Button title="Add Water Entry" onPress={handleAddWater} />

      <View style={{ marginTop: 24 }}>{renderGroupedEntries()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subheader: { fontSize: 18, marginBottom: 16, color: '#666' },
  ounceControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  adjustBtn: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  adjustText: {
    fontSize: 24,
    color: '#fff',
  },
  ounceText: {
    fontSize: 20,
    fontWeight: '600',
  },
  groupSection: {
    marginBottom: 20,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
    marginVertical: 4,
  },
  itemText: { fontSize: 16 },
  delete: { fontSize: 18, color: 'red' },
});
