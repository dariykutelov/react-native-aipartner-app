import AsyncStorage from '@react-native-async-storage/async-storage';

export type Gender = 'male' | 'female';
const GENDER_KEY = '@gender_preference';

export const getStoredGender = async (): Promise<Gender | null> => {
  try {
    const gender = await AsyncStorage.getItem(GENDER_KEY);
    return gender as Gender | null;
  } catch (error) {
    console.error('Error getting gender:', error);
    return null;
  }
};

export const setStoredGender = async (gender: Gender | null): Promise<void> => {
  try {
    if (gender === null) {
      await AsyncStorage.removeItem(GENDER_KEY);
    } else {
      await AsyncStorage.setItem(GENDER_KEY, gender);
    }
  } catch (error) {
    console.error('Error setting gender:', error);
  }
};