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
import { db, auth } from '../services/firebase';
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
import { WaterEntry } from '../types/types';

const WaterHistoryScreen = () => {
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<WaterEntry | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const fetchWaterEntries = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log('No user signed in');
      return;
    }

    try {
      const waterRef = collection(db, 'users', user.uid, 'water');
      const q = query(waterRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const entries: WaterEntry[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        amount: docSnap.data().amount,
        timestamp: docSnap.data().timestamp,
      }));
      setWaterEntries(entries);
    } catch (error) {
      console.error('Error fetching water entries:', error);
    }
  };

  useEffect(() => {
    fetchWaterEntries();
  }, []);

  const handleDelete = async (id: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.log('No user signed in');
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'water', id));
      fetchWaterEntries();
    } catch (error) {
      console.error('Error deleting water entry:', error);
    }
  };

  const handleEdit = (entry: WaterEntry) => {
    setEditingEntry(entry);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (updatedAmount: number) => {
    if (!editingEntry) return;

    const user = auth.currentUser;
    if (!user) {
      console.log('No user signed in');
      return;
    }

    try {
      const entryRef = doc(db, 'users', user.uid, 'water', editingEntry.id);
      await updateDoc(entryRef, { amount: updatedAmount });
      setEditModalVisible(false);
      setEditingEntry(null);
      fetchWaterEntries();
    } catch (error) {
      console.error('Error updating water entry:', error);
    }
  };

  const renderItem = ({ item }: { item: WaterEntry }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.amount} oz</Title>
        <Text>{item.timestamp.toDate().toLocaleString()}</Text>
      </Card.Content>
      <Card.Actions>
        <IconButton icon="pencil" onPress={() => handleEdit(item)} />
        <IconButton
          icon="trash-can"
          onPress={() =>
            Alert.alert(
              'Confirm Delete',
              'Are you sure you want to delete this entry?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item.id) },
              ]
            )
          }
        />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={waterEntries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Title>Edit Entry</Title>
            {editingEntry && (
              <View>
                <Button
                  mode="contained"
                  onPress={() => handleSaveEdit(editingEntry.amount + 8)}
                >
                  Add 8 oz
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleSaveEdit(Math.max(0, editingEntry.amount - 8))}
                >
                  Subtract 8 oz
                </Button>
              </View>
            )}
            <Button onPress={() => setEditModalVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WaterHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  listContent: { paddingBottom: 20 },
  card: { marginBottom: 10 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },
});
