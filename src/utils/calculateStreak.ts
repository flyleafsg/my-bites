import { WaterEntry } from '../context/AppContext'; // update if your type is elsewhere
import { isSameDay, subDays } from 'date-fns';

export const calculateHydrationStreak = (entries: WaterEntry[]): number => {
  const datesSet = new Set<string>();

  // Collect unique YYYY-MM-DD strings
  entries.forEach(entry => {
    const date = new Date(entry.timestamp);
    const key = date.toISOString().substring(0, 10); // '2025-05-18'
    datesSet.add(key);
  });

  let streak = 0;
  let dayCursor = new Date(); // today

  while (true) {
    const key = dayCursor.toISOString().substring(0, 10);
    if (datesSet.has(key)) {
      streak += 1;
      dayCursor = subDays(dayCursor, 1); // move to previous day
    } else {
      break;
    }
  }

  return streak;
};
