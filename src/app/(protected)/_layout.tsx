import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import ChatClient from '~/components/stream/ChatClient';

export default function ProtectedLayout() {
  const router = useRouter();

  return (
    <ChatClient>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Chats',
            headerRight: () => (
              <TouchableOpacity onPress={() => router.push('/(protected)/profile')}>
                <Ionicons name="person-circle-outline" size={24} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      </Stack>
    </ChatClient>
  );
}
