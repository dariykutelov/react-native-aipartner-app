import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useAnimatedReaction, useSharedValue, runOnJS } from 'react-native-reanimated';
import { useChatContext } from 'stream-chat-expo';

import { MatchCard } from '~/components/match/MatchCard';
import { newAIMessage } from '~/http/requests';
import { supabase } from '~/lib/supabase';
import useStore from '~/store';
import { AIAgent } from '~/types/AIAgent';
import { getStoredGender } from '~/utils/genderStorage';

export default function MatchScreen() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const activeIndex = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const user = useStore((state) => state.user);
  const { client } = useChatContext();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      async function loadAgents() {
        const storedGender = await getStoredGender();
        const { data } = await supabase.from('ai_agents').select('*').eq('gender', storedGender);
        setAgents(data as AIAgent[]);
        // Reset cards position when loading new agents
        activeIndex.value = 0;
        setIndex(0);
      }
      loadAgents();
    }, [])
  );

  useAnimatedReaction(
    () => activeIndex.value,
    (value, prevValue) => {
      if (Math.floor(value) !== index) {
        runOnJS(setIndex)(Math.floor(value));
      }
    }
  );

  const onMatch = async (isSwipeRight: boolean, agent: AIAgent) => {
    if (!user || !isSwipeRight) {
      return;
    }

    const { data, error } = await supabase
      .from('matches')
      .insert({
        user_id: user?.id,
        agent_id: agent.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating match: ', error);
      return;
    }

    console.log('Match created: ', data);
    const channel = client.channel('messaging', data.id, {
      name: 'Chat with ' + agent.name,
      members: [user.id, agent.id],
    });
    console.log('Channel: ', channel);
    channel.watch();
    newAIMessage(data.id);

    router.push('/channel');
  };

  const resetCards = () => {
    activeIndex.value = 0;
    setIndex(0);
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push('/(protected)')} className="ml-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerTitle: '',
          headerStyle: {
            // backgroundColor: '#111827',
            backgroundColor: 'white',
          },
          headerShadowVisible: false,
        }}
      />
      {index === agents.length ? (
        <View className="flex-1 items-center justify-center gap-4">
          <TouchableOpacity
            onPress={resetCards}
            className="flex-row items-center gap-2 rounded-full bg-white px-6 py-3">
            <Ionicons name="refresh" size={24} color="black" />
            <Text className="font-InterBold text-black">Start Over</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="mb-20 flex-1 items-center justify-center">
          {agents.map((agent, index) => (
            <MatchCard
              key={`${agent.id}-${index}`}
              user={agent}
              numOfCards={agents.length}
              index={index}
              activeIndex={activeIndex}
              onResponse={(res) => onMatch(res, agent)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
