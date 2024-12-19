import { Redirect, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Channel, MessageList, MessageInput, AITypingIndicatorView } from 'stream-chat-expo';

import { ControlAIButton } from '~/components/stream/ControlAIButton';
import useStore from '~/store';

export default function ChannelScreen() {
  const channel = useStore((state) => state.channel);

  if (!channel) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }}>
      <Stack.Screen options={{ headerTitle: channel.data?.name || 'Chat' }} />
      <Channel channel={channel}>
        <ControlAIButton channel={channel} />
        <MessageList />
        <AITypingIndicatorView />
        <MessageInput />
      </Channel>
    </SafeAreaView>
  );
}
