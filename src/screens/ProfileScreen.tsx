import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, Button, Alert } from 'react-native';
import { auth, db } from '../services/firebase';  // ✅ uses your existing firebase.modular.ts service
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProfileScreen = () => {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [hydrationTarget, setHydrationTarget] = useState('64'); // default target
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const profileRef = doc(db, 'users', user.uid, 'profile');
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setName(data.name || '');
        setHydrationTarget(data.hydrationTarget?.toString() || '64');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name is required.');
      return;
    }

    const targetValue = parseInt(hydrationTarget);
    if (isNaN(targetValue) || targetValue < 16 || targetValue > 256) {
      Alert.alert('Validation Error', 'Hydration target must be between 16 and 256 oz.');
      return;
    }

    const profileRef = doc(db, 'users', user.uid, 'profile');
    await setDoc(profileRef, {
      name: name.trim(),
      email: user.email,
      hydrationTarget: targetValue,
    });

    Alert.alert('Success', 'Profile updated!');
  };

  if (loading) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email (read-only)</Text>
      <TextInput style={styles.input} value={user?.email || ''} editable={false} />

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Hydration Target (oz)</Text>
      <TextInput
        style={styles.input}
        value={hydrationTarget}
        onChangeText={setHydrationTarget}
        keyboardType="numeric"
      />

      <Button title="Save Profile" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});

export default ProfileScreen;
