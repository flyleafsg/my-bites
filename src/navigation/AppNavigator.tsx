import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import LogMealScreen from '../screens/LogMealScreen';
import MealHistoryScreen from '../screens/MealHistoryScreen';
import LogWaterScreen from '../screens/LogWaterScreen';
import WaterHistoryScreen from '../screens/WaterHistoryScreen';
import BadgeCollectionScreen from '../screens/BadgeCollectionScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

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
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,  // ✅ shows back arrows automatically!
        }}
      >
        {!hasOnboarded ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="LogMeal" component={LogMealScreen} />
            <Stack.Screen name="MealHistory" component={MealHistoryScreen} />
            <Stack.Screen name="LogWater" component={LogWaterScreen} />
            <Stack.Screen name="WaterHistory" component={WaterHistoryScreen} />
            <Stack.Screen name="BadgeCollection" component={BadgeCollectionScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
