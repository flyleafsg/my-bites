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
  Button,
  Card,
  IconButton,
  Title,
} from 'react-native-paper';
// NEW - modular style
import { db, auth } from '../services/firebase.modular';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
  orderBy,
  query,
} from 'firebase/firestore';

type WaterEntry = {
  id: string;
  ounces: number;
  timestamp: Timestamp;
};

const WaterHistoryScreen = () => {
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<WaterEntry | null>(null);
  const [editedAmount, setEditedAmount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchWaterEntries = async () => {
    const q = query(collection(db, 'water'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const data: WaterEntry[] = [];
    querySnapshot.forEach((docSnap) => {
      const entry = docSnap.data() as Omit<WaterEntry, 'id'>;
      data.push({ id: docSnap.id, ...entry });
    });
    setWaterEntries(data);
  };

  useEffect(() => {
    fetchWaterEntries();
  }, []);

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
        titleStyle={styles.cardTitle}
        subtitle={`Logged: ${item.timestamp.toDate().toLocaleString()}`}
        subtitleStyle={styles.cardSubtitle}
        right={() => (
          <View style={styles.iconContainer}>
            <IconButton
              icon="pencil"
              onPress={() => handleEdit(item)}
              accessibilityLabel="Edit Entry"
              iconColor="#FFFFFF"
            />
            <IconButton
              icon="delete"
              onPress={() => confirmDelete(item.id)}
              accessibilityLabel="Delete Entry"
              iconColor="#FFFFFF"
            />
          </View>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.header}>Water Intake History</Title>

      <FlatList
        data={waterEntries}
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        contentContainerStyle={styles.list}
      />

      {/* Enhanced Edit Modal with +/- */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Water Amount</Text>

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

export default WaterHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F4F9FC',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 10,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    marginVertical: 6,
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#CCCCCC',
    fontSize: 13,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
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
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
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
    marginHorizontal: 12,
  },
  editAmountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0288D1',
  },
  button: {
    marginTop: 8,
    width: '100%',
  },
});
