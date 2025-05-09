import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import LogMealScreen from '../screens/LogMealScreen';
import MealHistoryScreen from '../screens/MealHistoryScreen';
import WaterIntakeScreen from '../screens/WaterIntakeScreen';
import WaterHistoryScreen from '../screens/WaterHistoryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Food Diary' }} />
        <Stack.Screen name="LogMeal" component={LogMealScreen} />
        <Stack.Screen name="MealHistory" component={MealHistoryScreen} />
        <Stack.Screen name="WaterIntake" component={WaterIntakeScreen} />
        <Stack.Screen name="WaterHistory" component={WaterHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
