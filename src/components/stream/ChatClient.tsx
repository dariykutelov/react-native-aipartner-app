import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useCreateChatClient, Chat } from 'stream-chat-expo';

import useStore from '~/store';
import { getStreamToken } from '~/utils/strem';

export default function ChatClient({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user);

  const client = useCreateChatClient({
    apiKey: process.env.EXPO_PUBLIC_STREAM_API_KEY!,
    tokenOrProvider: getStreamToken,
    userData: {
      id: user?.id || '14', // Make sure this matches the user_id in your token
      name: user?.email || 'Anonymous',
    },
  });

  useEffect(() => {
    if (!client) {
      return;
    }
    const channel = client.channel('messaging', 'mychat2', {
      name: 'MyChat',
      members: [user?.id || '14'],
    });
    channel.watch();
  }, [client]);

  if (!client) {
    return (
      <View className="flex-1 items-center justify-center bg-amber-50">
        <ActivityIndicator color="#000" />
      </View>
    );
  }

  return <Chat client={client}>{children}</Chat>;
}
