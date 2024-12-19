import { router } from 'expo-router';
import { View, TouchableOpacity, Text } from 'react-native';

import useStore from '~/store';

export default function Profile() {
  const signOut = useStore((state) => state.signOut);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/signin');
  };

  return (
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity className="rounded-lg bg-red-500 px-4 py-2" onPress={handleSignOut}>
        <Text className="text-white">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
