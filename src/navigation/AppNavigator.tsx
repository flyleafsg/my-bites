import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainTabs from './MainTabs';
import OnboardingScreen from '../screens/OnboardingScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const onboardFlag = await AsyncStorage.getItem('hasOnboarded');
      setHasOnboarded(onboardFlag === 'true');
      setIsLoading(false);
    };
    checkOnboarding();
  }, []);

  if (isLoading) return null;

  return (
    <Stack.Navigator
      initialRouteName={hasOnboarded ? 'MainTabs' : 'Onboarding'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
