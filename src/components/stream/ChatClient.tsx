import { ActivityIndicator, View } from 'react-native';
import { useCreateChatClient, Chat, MessageType } from 'stream-chat-expo';

import useStore from '~/store';
import { getStreamToken } from '~/utils/stream';

export default function ChatClient({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user);

  const client = useCreateChatClient({
    apiKey: process.env.EXPO_PUBLIC_STREAM_API_KEY!,
    tokenOrProvider: getStreamToken,
    userData: {
      id: user?.id || '14',
      name: user?.email || 'Anonymous',
    },
  });

  if (!client) {
    return (
      <View className="flex-1 items-center justify-center bg-amber-50">
        <ActivityIndicator color="#000" />
      </View>
    );
  }

  return (
    <Chat client={client} isMessageAIGenerated={(message: MessageType) => !!message.ai_generated}>
      {children}
    </Chat>
  );
}
