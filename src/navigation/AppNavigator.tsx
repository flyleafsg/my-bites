import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LogMealScreen from '../screens/LogMealScreen';
import LogWaterScreen from '../screens/LogWaterScreen';
import MealHistoryScreen from '../screens/MealHistoryScreen';
import WaterHistoryScreen from '../screens/WaterHistoryScreen';
import BadgeCollectionScreen from '../screens/BadgeCollectionScreen';

export type RootStackParamList = {
  Home: undefined;
  LogMeal: undefined;
  LogWater: undefined;
  MealHistory: undefined;
  WaterHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Meal Diary Dashboard' }} />
      <Stack.Screen name="LogMeal" component={LogMealScreen} options={{ title: 'Log a Meal' }} />
      <Stack.Screen name="LogWater" component={LogWaterScreen} options={{ title: 'Log Water Intake' }} />
      <Stack.Screen name="MealHistory" component={MealHistoryScreen} options={{ title: 'Meal History' }} />
      <Stack.Screen name="WaterHistory" component={WaterHistoryScreen} options={{ title: 'Water Intake History' }} />
      <Stack.Screen name="BadgeCollection" component={BadgeCollectionScreen}/>
    </Stack.Navigator>
  );
}
