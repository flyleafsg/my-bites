import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import LogMealScreen from '../screens/LogMealScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Food Diary' }} />
        <Stack.Screen name="LogMeal" component={LogMealScreen} options={{ title: 'Log Meal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
