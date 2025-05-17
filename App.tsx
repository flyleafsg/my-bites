import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
 return (
  <PaperProvider>
    <NavigationContainer>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </NavigationContainer>
  </PaperProvider>
);

}
