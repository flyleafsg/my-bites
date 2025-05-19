import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  IconButton,
  Title,
  ProgressBar,
} from 'react-native-paper';
import { db } from '../services/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  query,
} from 'firebase/firestore';

type WaterEntry = {
  id: string;
  ounces: number;
  timestamp: Timestamp;
};

const DAILY_GOAL = 64;

const LogWaterScreen = () => {
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [totalIntake, setTotalIntake] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<WaterEntry | null>(null);
  const [editedAmount, setEditedAmount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progressAnim] = useState(new Animated.Value(0));

  const fetchWaterEntries = async () => {
    const q = query(collection(db, 'water'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const data: WaterEntry[] = [];
    let total = 0;
    querySnapshot.forEach((docSnap) => {
      const entry = docSnap.data() as Omit<WaterEntry, 'id'>;
      data.push({ id: docSnap.id, ...entry });
      total += entry.ounces;
    });
    setWaterEntries(data);
    setTotalIntake(total);
    animateProgress(total);
  };

  const animateProgress = (intake: number) => {
    const progress = Math.min(intake / DAILY_GOAL, 1);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    fetchWaterEntries();
  }, []);

  const handleAddWater = async () => {
    if (currentAmount <= 0) return;

    await addDoc(collection(db, 'water'), {
      ounces: currentAmount,
      timestamp: Timestamp.now(),
    });

    setCurrentAmount(0);
    fetchWaterEntries();
  };

  const confirmDelete = (id: string) => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('Are you sure you want to delete this?');
      if (confirm) handleDelete(id);
    } else {
      Alert.alert(
        'Delete Entry',
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
    await deleteDoc(doc(db, 'water', id));
    fetchWaterEntries();
  };

  const handleEdit = (entry: WaterEntry) => {
    setSelectedEntry(entry);
    setEditedAmount(entry.ounces);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (selectedEntry && editedAmount > 0) {
      await updateDoc(doc(db, 'water', selectedEntry.id), {
        ounces: editedAmount,
      });
      setIsModalVisible(false);
      setSelectedEntry(null);
      fetchWaterEntries();
    }
  };

  const renderEntry = ({ item }: { item: WaterEntry }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`${item.ounces} oz`}
        subtitle={`Logged: ${item.timestamp.toDate().toLocaleString()}`}
        right={() => (
          <View style={styles.iconContainer}>
            <IconButton
              icon="pencil"
              onPress={() => handleEdit(item)}
              accessibilityLabel="Edit Entry"
            />
            <IconButton
              icon="delete"
              onPress={() => confirmDelete(item.id)}
              accessibilityLabel="Delete Entry"
            />
          </View>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.totalText}>Total Water Today: {totalIntake} oz</Title>

      {/* Glowing Hydration Bar */}
    <View style={styles.progressContainer}>
      <View style={styles.progressWrapper}>
       <Animated.View style={[styles.glow, { opacity: progressAnim }]} />
       <ProgressBar
         progress={progressAnim as unknown as number}
         color="#03A9F4"
         style={styles.progressBar}
    />
  </View>
  <Text style={styles.goalText}>Goal: {DAILY_GOAL} oz</Text>
</View>

      <View style={styles.adjustContainer}>
        <Button
          mode="contained"
          onPress={() => setCurrentAmount((prev) => prev + 8)}
          style={styles.pillButton}
          buttonColor="#4FC3F7"
          textColor="white"
        >
          +
        </Button>
        <Text style={styles.amountText}>{currentAmount} oz</Text>
        <Button
          mode="contained"
          onPress={() => setCurrentAmount((prev) => Math.max(prev - 1, 0))}
          style={styles.pillButton}
          buttonColor="#4FC3F7"
          textColor="white"
        >
          –
        </Button>
      </View>

      <Button
        mode="contained"
        onPress={handleAddWater}
        style={styles.saveButton}
        disabled={currentAmount <= 0}
        buttonColor="#0288D1"
        textColor="white"
      >
        Save Entry
      </Button>

      <FlatList
        data={waterEntries}
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        contentContainerStyle={styles.list}
      />

      {/* Edit Modal with + / - Controls */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text>Edit Water Amount</Text>
            <View style={styles.editAdjustContainer}>
              <Button
                mode="contained"
                onPress={() => setEditedAmount((prev) => Math.max(prev - 1, 0))}
                style={styles.smallPillButton}
                buttonColor="#4FC3F7"
                textColor="white"
              >
                –
              </Button>
              <Text style={styles.editAmountText}>{editedAmount} oz</Text>
              <Button
                mode="contained"
                onPress={() => setEditedAmount((prev) => prev + 8)}
                style={styles.smallPillButton}
                buttonColor="#4FC3F7"
                textColor="white"
              >
                +
              </Button>
            </View>
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

export default LogWaterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F4F9FC',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  progressContainer: {
  marginTop: 8,
  marginBottom: 12,
  alignItems: 'center',
},

progressWrapper: {
  width: '90%',
  height: 14,
  borderRadius: 10,
  overflow: 'hidden', // clips the glow to match bar radius
  position: 'relative',
  backgroundColor: '#E0F7FA',
},

progressBar: {
  height: 14,
  backgroundColor: 'transparent',
},

glow: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 14,
  borderRadius: 10,
  backgroundColor: '#81D4FA',
  shadowColor: '#81D4FA',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.9,
  shadowRadius: 6,
  zIndex: -1,
},
  goalText: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
  adjustContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  pillButton: {
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0288D1',
  },
  saveButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
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
  editAdjustContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  smallPillButton: {
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0288D1',
  },
  button: {
    marginTop: 8,
  },
});
