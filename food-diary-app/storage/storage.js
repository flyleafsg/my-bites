import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveMeal = async (mealType, entry) => {
  try {
    const key = `@meal_log_${mealType}`;
    const existing = await AsyncStorage.getItem(key);
    const parsed = existing ? JSON.parse(existing) : [];

    const updated = [...parsed, entry];
    await AsyncStorage.setItem(key, JSON.stringify(updated));
    console.log('✅ Saved to AsyncStorage key:', key);
  } catch (error) {
    console.error('❌ Error saving meal:', error);
  }
};

export const getMeals = async (mealType) => {
  try {
    const key = `@meal_log_${mealType}`;
    console.log('📥 Fetching from key:', key); // This should appear in your console
    const stored = await AsyncStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('❌ Error fetching meals:', error);
    return [];
  }
};
