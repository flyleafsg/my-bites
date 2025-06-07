import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';

// Import screens
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
  const { hasOnboarded } = useAppContext();

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
