import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Gender, setStoredGender } from '~/utils/genderStorage';

export default function GenderScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender>('female');

  const handleContinue = async () => {
    await setStoredGender(selectedGender);
    router.push('/signin');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1 gap-4 p-6">
        <View className="mb-12">
          <Text className="text-3xl font-bold text-white">💬 Get Started Now!</Text>
          <Text className="mt-2 text-lg text-gray-100">
            Start a conversation and explore a world of personalized interactions. Your AI companion
            is here to chat, inspire, and entertain!
          </Text>
        </View>
        <View className="gap-4">
          <Text className="text-3xl font-bold text-white">
            What is your preference for AI companion?
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedGender('female')}
            className={`rounded-xl border-2 p-4 ${
              selectedGender === 'female' ? 'border-gray-50 bg-gray-50' : 'border-gray-200'
            }`}>
            <Text
              className={`text-lg ${
                selectedGender === 'female' ? 'font-bold text-black' : 'text-gray-100'
              }`}>
              Girl
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedGender('male')}
            className={`rounded-xl border-2 p-4 ${
              selectedGender === 'male' ? 'border-gray-50 bg-gray-50' : 'border-gray-200'
            }`}>
            <Text
              className={`text-lg ${
                selectedGender === 'male' ? 'font-bold text-black' : 'text-gray-100'
              }`}>
              Boy
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View className="mb-4 mt-auto px-6">
        <TouchableOpacity className="rounded-lg bg-white p-4" onPress={handleContinue}>
          <Text className="text-center text-lg font-bold text-black">Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
