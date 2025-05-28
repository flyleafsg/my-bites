import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
  Animated,
  Image,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  IconButton,
  Title,
  ProgressBar,
} from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
// NEW - modular style
import { db, auth } from '../services/firebase.modular';
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
import BadgeUnlockModal from '../components/BadgeUnlockModal';
import HydrationHeroIcon from '../../assets/hydration-hero.png'; // ✅ correct


type WaterEntry = {
  id: string;
  amount: number;
  timestamp: Timestamp;
};

const DAILY_GOAL = 64;

const LogWaterScreen = () => {
  const { user, addWaterEntry } = useAppContext();
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [totalIntake, setTotalIntake] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<WaterEntry | null>(null);
  const [editedAmount, setEditedAmount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);
  const [progressAnim] = useState(new Animated.Value(0));

  const fetchWaterEntries = async () => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'water'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const data: WaterEntry[] = [];
    let total = 0;
    querySnapshot.forEach((docSnap) => {
      const entry = docSnap.data();
      data.push({
        id: docSnap.id,
        amount: entry.amount,
        timestamp: entry.timestamp,
      });
      total += entry.amount;
    });
    setWaterEntries(data);
    setTotalIntake(total);
    animateProgress(total);

    // Badge trigger logic
    if (total >= DAILY_GOAL && !badgeUnlocked) {
      setBadgeUnlocked(true);
      setIsModalVisible(true);
    }
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
  }, [user]);

  const handleAddWater = async () => {
    if (currentAmount <= 0 || !user) return;
    await addWaterEntry(currentAmount);
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
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'water', id));
    fetchWaterEntries();
  };

  const handleEdit = (entry: WaterEntry) => {
    setSelectedEntry(entry);
    setEditedAmount(entry.amount);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (selectedEntry && editedAmount > 0 && user) {
      await updateDoc(doc(db, 'users', user.uid, 'water', selectedEntry.id), {
        amount: editedAmount,
      });
      setIsModalVisible(false);
      setSelectedEntry(null);
      fetchWaterEntries();
    }
  };

  const renderEntry = ({ item }: { item: WaterEntry }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`${item.amount} oz`}
        subtitle={`Logged: ${item.timestamp.toDate().toLocaleString()}`}
        right={() => (
          <View style={styles.iconContainer}>
            <IconButton icon="pencil" onPress={() => handleEdit(item)} />
            <IconButton icon="delete" onPress={() => confirmDelete(item.id)} />
          </View>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.totalText}>Total Water Today: {totalIntake} oz</Title>

      {/* Progress Bar */}
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

      {/* Adjust Water Amount */}
      <View style={styles.adjustContainer}>
        <Button
          mode="contained"
          onPress={() => setCurrentAmount((prev) => Math.max(prev - 1, 0))}
          style={styles.pillButton}
          buttonColor="#4FC3F7"
        >
          –
        </Button>
        <Text style={styles.amountText}>{currentAmount} oz</Text>
        <Button
          mode="contained"
          onPress={() => setCurrentAmount((prev) => prev + 8)}
          style={styles.pillButton}
          buttonColor="#4FC3F7"
        >
          +
        </Button>
      </View>

      <Button
        mode="contained"
        onPress={handleAddWater}
        style={styles.saveButton}
        disabled={currentAmount <= 0}
        buttonColor="#0288D1"
      >
        Save Entry
      </Button>

      <FlatList
        data={waterEntries}
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        contentContainerStyle={styles.list}
      />

      {/* Badge Unlock Modal */}
      <BadgeUnlockModal
        visible={isModalVisible && badgeUnlocked && totalIntake >= DAILY_GOAL}
        badgeName="Hydration Hero"
        badgeImage={HydrationHeroIcon}
        onDismiss={() => setIsModalVisible(false)}
      />
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
    overflow: 'hidden',
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
});
