import { WaterEntry } from '../context/AppContext';
import { subDays } from 'date-fns';

export const calculateHydrationStreak = (entries: WaterEntry[]): number => {
  // Group entries by date in 'YYYY-MM-DD' and sum ounces
  const dailyTotals: Record<string, number> = {};

  entries.forEach(entry => {
    const date = new Date(entry.timestamp);
    const key = date.toISOString().substring(0, 10); // e.g., '2025-05-18'

    if (!dailyTotals[key]) {
      dailyTotals[key] = 0;
    }

    dailyTotals[key] += entry.amount || 0; // assuming entry.amount is in oz
  });

  let streak = 0;
  let dayCursor = new Date(); // today

  while (true) {
    const key = dayCursor.toISOString().substring(0, 10);
    const totalForDay = dailyTotals[key] || 0;

    if (totalForDay >= 64) {
      streak += 1;
      dayCursor = subDays(dayCursor, 1); // move back one day
    } else {
      break;
    }
  }

  return streak;
};
