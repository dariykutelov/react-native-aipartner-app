import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <View className="flex-1">
        <View className="mb-8 p-6">
          <Text className="mb-4 text-xl font-bold">Chat Partner</Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => handleGenderChange('female')}
              className={`flex-1 rounded-xl border-2 p-4 ${
                selectedGender === 'female' ? 'border-gray-500 bg-gray-50' : 'border-gray-200'
              }`}>
              <Text
                className={`text-lg ${
                  selectedGender === 'female' ? 'font-bold text-gray-500' : 'text-gray-700'
                }`}>
                Female
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleGenderChange('male')}
              className={`flex-1 rounded-xl border-2 p-4 ${
                selectedGender === 'male' ? 'border-gray-500 bg-gray-50' : 'border-gray-200'
              }`}>
              <Text
                className={`text-lg ${
                  selectedGender === 'male' ? 'font-bold text-gray-500' : 'text-gray-700'
                }`}>
                Male
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4 mt-auto px-6">
          <TouchableOpacity className="rounded-lg bg-black p-4" onPress={handleSignOut}>
            <Text className="text-center text-white">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
