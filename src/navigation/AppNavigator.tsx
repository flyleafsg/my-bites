import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

// Import your screens
import HomeScreen from '../screens/HomeScreen';
import LogMealScreen from '../screens/LogMealScreen';
import MealHistoryScreen from '../screens/MealHistoryScreen';
import LogWaterScreen from '../screens/LogWaterScreen';
import WaterHistoryScreen from '../screens/WaterHistoryScreen';
import BadgeCollectionScreen from '../screens/BadgeCollectionScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onboardFlag = await AsyncStorage.getItem('hasOnboarded');
        setHasOnboarded(onboardFlag === 'true');
      } catch (error) {
        console.error('Error reading onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  if (isLoading) {
    return null; // Optional: you can replace this with a loading spinner later
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!hasOnboarded ? (
          <Stack.Screen
            name="OnboardingScreen"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="LogMealScreen" component={LogMealScreen} />
            <Stack.Screen name="MealHistoryScreen" component={MealHistoryScreen} />
            <Stack.Screen name="LogWaterScreen" component={LogWaterScreen} />
            <Stack.Screen name="WaterHistoryScreen" component={WaterHistoryScreen} />
            <Stack.Screen name="BadgeCollectionScreen" component={BadgeCollectionScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
