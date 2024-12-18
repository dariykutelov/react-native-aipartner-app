import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useCreateChatClient, Chat } from 'stream-chat-expo';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTQifQ.bdQQXMqNELcnEIW8fYKvqqKEa7I4DzNzJeyL5hsx-oU';

export default function ChatClient({ children }: { children: React.ReactNode }) {
  const client = useCreateChatClient({
    apiKey: process.env.EXPO_PUBLIC_STREAM_API_KEY!,
    tokenOrProvider: token,
    userData: {
      id: '14', // Make sure this matches the user_id in your token
      name: 'Dari',
    },
  });

  useEffect(() => {
    if (!client) {
      return;
    }
    const channel = client.channel('messaging', 'mychat', {
      name: 'MyChat',
      members: ['14'],
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
