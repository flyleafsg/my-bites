import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Image, Dimensions } from 'react-native';
import { Text, Button, Title } from 'react-native-paper';
import AppIntroSlider from 'react-native-app-intro-slider';
import { auth, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const user = auth.currentUser;
  const { setHasOnboarded } = useAppContext();

  const [name, setName] = useState('');
  const [hydrationTarget, setHydrationTarget] = useState('64');
  const [loading, setLoading] = useState(false);

  const handleOnboardingComplete = async () => {
    if (!user) {
      alert('User not authenticated.');
      return;
    }

    if (name.trim() === '' || hydrationTarget.trim() === '') {
      alert('Please complete all fields.');
      return;
    }

    try {
      setLoading(true);

      const profileRef = doc(db, 'profiles', user.uid);
      await setDoc(profileRef, {
        name: name.trim(),
        hydrationTarget: parseInt(hydrationTarget),
        createdAt: new Date(),
      });

      await setHasOnboarded(true); // ✅ Update context, navigator refreshes automatically
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  const slides = [
    {
      key: 'slide1',
      title: 'Welcome to My Bites!',
      text: 'Track your meals and hydration easily.',
      image: require('../../assets/onboarding1.png'),
    },
    {
      key: 'slide2',
      title: 'Stay On Track',
      text: 'Monitor your water intake and earn badges.',
      image: require('../../assets/onboarding2.png'),
    },
    {
      key: 'slide3',
      title: 'Build Healthy Streaks',
      text: 'Don’t break your streak — stay hydrated daily!',
      image: require('../../assets/onboarding3.png'),
    },
    {
      key: 'slide4',
      title: 'Create Your Profile',
      content: (
        <View style={styles.profileContainer}>
          <TextInput
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Daily hydration target (oz)"
            value={hydrationTarget}
            onChangeText={setHydrationTarget}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleOnboardingComplete}
            loading={loading}
            style={styles.button}
          >
            Complete Setup
          </Button>
        </View>
      ),
    },
  ];

  const renderItem = ({ item }: any) => {
    if (item.content) {
      return (
        <View style={styles.slide}>
          <Title>{item.title}</Title>
          {item.content}
        </View>
      );
    }

    return (
      <View style={styles.slide}>
        <Title>{item.title}</Title>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  return (
    <AppIntroSlider
      data={slides}
      renderItem={renderItem}
      showNextButton
      showDoneButton={false}
    />
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  profileContainer: {
    width: '100%',
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
