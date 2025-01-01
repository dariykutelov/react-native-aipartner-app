import { Ionicons } from '@expo/vector-icons';
import { Redirect, Stack, useFocusEffect, useRouter } from 'expo-router';
import { Alert, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Channel, MessageList, MessageInput, AITypingIndicatorView } from 'stream-chat-expo';

import { startAI, stopAI } from '~/http/requests';
import { supabase } from '~/lib/supabase';
import useStore from '~/store';

export default function ChannelScreen() {
  const channel = useStore((state) => state.channel);
  const router = useRouter();

  const handleDelete = async () => {
    if (!channel) return;

    Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Delete from Supabase matches
            await supabase.from('matches').delete().eq('id', channel.id);

            // Delete from Stream
            await channel.delete();

            // Navigate back
            router.back();
          } catch (error) {
            console.error('Error deleting channel:', error);
            Alert.alert('Error', 'Failed to delete chat');
          }
        },
      },
    ]);
  };

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
    <>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }}>
        <Stack.Screen
          options={{
            headerTitle: channel.data?.name || 'Chat',
            headerRight: () => (
              <TouchableOpacity onPress={handleDelete} className="mr-4">
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            ),
          }}
        />
        <Channel channel={channel}>
          <MessageList />
          <AITypingIndicatorView />
          <View className="bg-white">
            <MessageInput />
          </View>
        </Channel>
      </SafeAreaView>
    </>
  );
}
