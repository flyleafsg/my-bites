// /src/types/types.ts

import { Timestamp } from 'firebase/firestore';

export interface MealEntry {
  id: string;
  name: string;
  type: string;
  timestamp: Timestamp;
}

export interface WaterEntry {
  id: string;
  amount: number;
  timestamp: Timestamp;
}

export interface FavoriteEntry {
  id: string;
  name: string;
  type: string;
  timestamp: Timestamp;
}

export interface ProfileData {
  name: string;
  hydrationTarget: string;
}
