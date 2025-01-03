import { RelativePathString, router } from 'expo-router';
import { View, Text, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../../../assets/images/onboarding_background.jpeg')}
        className="flex-1"
        resizeMode="cover">
        <SafeAreaView className="flex-1">
          <View className="flex-1 p-6">
            <View className="mt-auto gap-4">
              <Text className="text-4xl font-bold text-white">Welcome</Text>
              <Text className="text-xl text-gray-100">
                Let's setup your account and get you started.
              </Text>
            </View>

            <View className="mb-8 mt-8">
              <TouchableOpacity
                className="rounded-lg bg-white p-4"
                onPress={() => router.push('/onboarding/info' as RelativePathString)}>
                <Text className="text-center text-lg font-bold text-black">Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}
