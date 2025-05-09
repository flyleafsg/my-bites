import AsyncStorage from '@react-native-async-storage/async-storage';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];

export const resetTodayMealLogs = async () => {
  const today = new Date().toDateString();

  for (const type of mealTypes) {
    const key = `@meal_log_${type}`;
    const data = await AsyncStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const filtered = parsed.filter(
          (entry) => new Date(entry.timestamp).toDateString() !== today
        );
        await AsyncStorage.setItem(key, JSON.stringify(filtered));
      } catch (e) {
        console.error(`Error resetting ${type} logs:`, e);
      }
    }
  }
};
