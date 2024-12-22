import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useAnimatedReaction, useSharedValue, runOnJS } from 'react-native-reanimated';
import { useChatContext } from 'stream-chat-expo';

import { MatchCard } from '~/components/match/MatchCard';
import { newAIMessage } from '~/http/requests';
import { supabase } from '~/lib/supabase';
import useStore from '~/store';
import { AIAgent } from '~/types/AIAgent';

type Gender = 'male' | 'female';

export default function MatchScreen() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [gender, setGender] = useState<Gender>('female');
  const activeIndex = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const user = useStore((state) => state.user);
  const { client } = useChatContext();

  useEffect(() => {
    async function fetchAgents() {
      const { data } = await supabase.from('ai_agents').select('*').eq('gender', gender);
      setAgents(data as AIAgent[]);
    }
    fetchAgents();
  }, [gender]);

  useAnimatedReaction(
    () => activeIndex.value,
    (value, prevValue) => {
      if (Math.floor(value) !== index) {
        runOnJS(setIndex)(Math.floor(value));
      }
    }
  );

  useEffect(() => {
    if (index === agents.length - 1) {
      console.log('Last card');
      // TODO: render buttons exit, start from the beginning
    }
  }, [index]);

  const onMatch = async (isSwipeRight: boolean, agent: AIAgent) => {
    console.log('isSwipeRight: ', isSwipeRight);

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
    channel.watch();
    newAIMessage(data.id);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Stack.Screen options={{ headerShown: false }} />
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
  );
}
