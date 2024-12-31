import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '~/components/Button';
import { Gender, setStoredGender } from '~/utils/genderStorage';

export default function GenderScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender>('female');

  const handleContinue = async () => {
    await setStoredGender(selectedGender);
    router.push('/(protected)');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-6">
        <View className="mb-12">
          <Text className="text-3xl font-bold">Select Preference</Text>
          <Text className="mt-2 text-gray-600">Choose which profiles you'd like to see</Text>
        </View>

        <View className="gap-4">
          <TouchableOpacity
            onPress={() => setSelectedGender('female')}
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
            onPress={() => setSelectedGender('male')}
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

        <View className="mt-auto">
          <Button title="Continue" onPress={handleContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
}
