// src/screens/OnboardingScreen.tsx

import React from 'react';
import { StyleSheet, Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const handleDone = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <Onboarding
      onDone={handleDone}
      onSkip={handleDone}
      bottomBarHighlight={false}
      pages={[
        {
          backgroundColor: '#fff',
          image: (
            <Image
              source={require('../../assets/onboarding1.png')}
              style={styles.image}
            />
          ),
          title: '',
          subtitle: '',
        },
        {
          backgroundColor: '#fff',
          image: (
            <Image
              source={require('../../assets/onboarding2.png')}
              style={styles.image}
            />
          ),
          title: '',
          subtitle: '',
        },
        {
          backgroundColor: '#fff',
          image: (
            <Image
              source={require('../../assets/onboarding3.png')}
              style={styles.image}
            />
          ),
          title: '',
          subtitle: '',
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});

export default OnboardingScreen;
