import { RelativePathString, router } from 'expo-router';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '~/components/Button';

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <View className="flex-1 bg-amber-50">
        <View className="flex-1 p-6">
          <View className="flex-1 items-center justify-center">
            <Image source={require('../../../../assets/images/logo.png')} className="h-52 w-52" />
          </View>

          <View className="mb-12 gap-4">
            <Text className="text-4xl font-bold text-amber-950">Welcome 👋🏼</Text>
            <Text className="text-xl text-amber-900">
              Let's setup your account and get you started.
            </Text>
          </View>

          <View className="w-full gap-4">
            <Button
              title="Get Started"
              onPress={() => router.push('/signin' as RelativePathString)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
