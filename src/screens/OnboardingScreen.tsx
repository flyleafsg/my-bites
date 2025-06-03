import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
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
          title: null,
          subtitle: null,
          image: (
            <View style={styles.wrapper}>
              <Image source={require('../../assets/onboarding1.png')} style={styles.image} />
            </View>
          ),
        },
        {
          backgroundColor: '#fff',
          title: null,
          subtitle: null,
          image: (
            <View style={styles.wrapper}>
              <Image source={require('../../assets/onboarding2.png')} style={styles.image} />
            </View>
          ),
        },
        {
          backgroundColor: '#fff',
          title: null,
          subtitle: null,
          image: (
            <View style={styles.wrapper}>
              <Image source={require('../../assets/onboarding3.png')} style={styles.image} />
            </View>
          ),
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});

export default OnboardingScreen;
