import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppContextType = {
  hasOnboarded: boolean;
  setHasOnboarded: (value: boolean) => void;
};

const AppContext = createContext<AppContextType>({
  hasOnboarded: false,
  setHasOnboarded: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasOnboarded, setHasOnboardedState] = useState(false);

  useEffect(() => {
    const loadOnboarding = async () => {
      const flag = await AsyncStorage.getItem('hasOnboarded');
      setHasOnboardedState(flag === 'true');
    };

    loadOnboarding();
  }, []);

  const setHasOnboarded = async (value: boolean) => {
    await AsyncStorage.setItem('hasOnboarded', value ? 'true' : 'false');
    setHasOnboardedState(value);
  };

  return (
    <AppContext.Provider value={{ hasOnboarded, setHasOnboarded }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
