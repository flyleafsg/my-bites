import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </AppProvider>
  );
}
