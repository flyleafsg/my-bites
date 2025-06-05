import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// NEW - modular style
import { db, auth } from '../services/firebase';
import { User, onAuthStateChanged, getAuth } from 'firebase/auth';
import {
  collection,
  addDoc,
  Timestamp
} from 'firebase/firestore';

export type MealEntry = {
  name: string;
  type: string;
  timestamp?: number;
};

export type WaterEntry = {
  amount: number;
  timestamp: Date;
};

type AppContextType = {
  mealLog: MealEntry[];
  addMealItem: (item: MealEntry) => void;
  addWaterEntry: (amount: number) => Promise<void>;
  user: User | null;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

let AsyncStorage: any;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (err) {
  console.warn('AsyncStorage not available on this platform.');
  AsyncStorage = {
    getItem: async () => null,
    setItem: async () => {},
  };
}

const STORAGE_KEY = 'mealLog';

export const AppProvider = ({ children }: AppProviderProps) => {
  const [mealLog, setMealLog] = useState<MealEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadCachedMeals = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: MealEntry[] = JSON.parse(stored);
          setMealLog(parsed);
        }
      } catch (error) {
        console.error('Error loading cached meal log:', error);
      }
    };

    loadCachedMeals();
  }, []);

  const addMealItem = async (item: MealEntry) => {
    const newItem = {
      ...item,
      timestamp: Date.now(),
    };

    const updated = [newItem, ...mealLog];
    setMealLog(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    try {
      if (db?.collection) {
        await db.collection('meals').add(newItem);
      } else {
        console.warn('Firestore not initialized — skipping cloud sync.');
      }
    } catch (error) {
      console.error('Failed to save meal to Firestore:', error);
    }
  };

  const addWaterEntry = async (amount: number) => {
    if (!user) {
      console.warn('User not authenticated — cannot log water.');
      return;
    }

    try {
      const ref = collection(db, 'users', user.uid, 'water');
      await addDoc(ref, {
        amount,
        timestamp: Timestamp.now(),
      });
      console.log('✅ Water entry saved:', { amount });
    } catch (error) {
      console.error('❌ Failed to log water:', error);
    }
  };

  return (
    <AppContext.Provider value={{ mealLog, addMealItem, addWaterEntry, user }}>
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
