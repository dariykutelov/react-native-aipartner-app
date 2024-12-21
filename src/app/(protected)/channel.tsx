import { Redirect, Stack, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Channel, MessageList, MessageInput, AITypingIndicatorView } from 'stream-chat-expo';

import { ControlAIButton } from '~/components/stream/ControlAIButton';
import { startAI, stopAI } from '~/http/requests';
import useStore from '~/store';

export default function ChannelScreen() {
  const channel = useStore((state) => state.channel);

  useFocusEffect(() => {
    if (channel?.id) {
      startAI(channel.id);
    }

    return () => {
      if (channel?.id) {
        stopAI(channel.id);
      }
    };
  });

  if (!channel) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }}>
      <Stack.Screen options={{ headerTitle: channel.data?.name || 'Chat' }} />
      <Channel channel={channel}>
        <MessageList />
        <AITypingIndicatorView />
        <MessageInput />
      </Channel>
    </SafeAreaView>
  );
}
