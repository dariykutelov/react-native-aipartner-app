import AsyncStorage from '@react-native-async-storage/async-storage';

export type Gender = 'male' | 'female';
const GENDER_KEY = '@gender_preference';

export const getStoredGender = async (): Promise<Gender> => {
  try {
    const gender = await AsyncStorage.getItem(GENDER_KEY);
    return (gender as Gender) || 'female';
  } catch (error) {
    console.error('Error getting gender:', error);
    return 'female';
  }
};

export const setStoredGender = async (gender: Gender): Promise<void> => {
  try {
    await AsyncStorage.setItem(GENDER_KEY, gender);
  } catch (error) {
    console.error('Error setting gender:', error);
  }
}; 