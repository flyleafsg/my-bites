import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MealEntry = {
  name: string;
  type: string;
};

type AppContextType = {
  mealLog: MealEntry[];
  addMealItem: (item: MealEntry) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [mealLog, setMealLog] = useState<MealEntry[]>([]);

  const addMealItem = (item: MealEntry) => {
    setMealLog((prev) => [item, ...prev]);
  };

  return (
    <AppContext.Provider value={{ mealLog, addMealItem }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
