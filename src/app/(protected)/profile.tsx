import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import useStore from '~/store';
import { Gender, getStoredGender, setStoredGender } from '~/utils/genderStorage';

export default function Profile() {
  const signOut = useStore((state) => state.signOut);
  const [selectedGender, setSelectedGender] = useState<Gender>('female');

  useEffect(() => {
    loadGender();
  }, []);

  const loadGender = async () => {
    const gender = await getStoredGender();
    setSelectedGender(gender);
  };

  const handleGenderChange = async (gender: Gender) => {
    await setStoredGender(gender);
    setSelectedGender(gender);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/signin');
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="mb-8">
        <Text className="mb-4 text-xl font-bold">Preferences</Text>
        <View className="gap-4">
          <TouchableOpacity
            onPress={() => handleGenderChange('female')}
            className={`rounded-xl border-2 p-4 ${
              selectedGender === 'female' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
            }`}>
            <Text
              className={`text-lg ${
                selectedGender === 'female' ? 'font-bold text-purple-500' : 'text-gray-700'
              }`}>
              Female
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleGenderChange('male')}
            className={`rounded-xl border-2 p-4 ${
              selectedGender === 'male' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
            }`}>
            <Text
              className={`text-lg ${
                selectedGender === 'male' ? 'font-bold text-purple-500' : 'text-gray-700'
              }`}>
              Male
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity className="mt-auto rounded-lg bg-red-500 px-4 py-2" onPress={handleSignOut}>
        <Text className="text-center text-white">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
