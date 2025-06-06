import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ProfileData } from '../types/types';

const ProfileScreen = () => {
  const user = auth.currentUser;
  const [name, setName] = useState<string>('');
  const [hydrationTarget, setHydrationTarget] = useState<string>('64');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const profileRef = doc(db, 'users', user.uid, 'profile');
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const data = profileSnap.data() as ProfileData;
        setName(data.name || '');
        setHydrationTarget(data.hydrationTarget || '64');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    try {
      const profileRef = doc(db, 'users', user.uid, 'profile');
      await setDoc(profileRef, {
        name,
        hydrationTarget,
      });
      await AsyncStorage.setItem('hasOnboarded', 'true');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' as never }],
      });
    } catch (error) {
      Alert.alert('Error saving profile');
    }
  };

  if (loading) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Hydration Target (oz)"
        value={hydrationTarget}
        keyboardType="numeric"
        onChangeText={setHydrationTarget}
      />
      <Button title="Save & Continue" onPress={saveProfile} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
});
