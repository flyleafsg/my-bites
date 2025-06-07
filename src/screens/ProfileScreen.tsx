import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Text, Button, Title } from 'react-native-paper';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [hydrationTarget, setHydrationTarget] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const profileRef = doc(db, 'profiles', user.uid);  // 🔧 MOVED TO /profiles/{uid}
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          setName(profileData.name || '');
          setHydrationTarget(profileData.hydrationTarget?.toString() || '');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        Alert.alert('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('User not authenticated');
      return;
    }

    if (name.trim() === '' || hydrationTarget.trim() === '') {
      Alert.alert('Please complete all fields');
      return;
    }

    try {
      setSaving(true);
      const profileRef = doc(db, 'profiles', user.uid);
      await setDoc(profileRef, {
        name: name.trim(),
        hydrationTarget: parseInt(hydrationTarget),
        updatedAt: new Date(),
      });

      Alert.alert('Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Edit Profile</Title>
      <TextInput
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Hydration target (oz)"
        value={hydrationTarget}
        onChangeText={setHydrationTarget}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSave} loading={saving} style={styles.button}>
        Save Profile
      </Button>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'white',
  },
  title: {
    marginBottom: 24,
    fontSize: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  button: {
    marginTop: 16,
  },
});
