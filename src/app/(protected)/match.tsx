import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useAnimatedReaction, useSharedValue, runOnJS } from 'react-native-reanimated';
import { useChatContext } from 'stream-chat-expo';

import { MatchCard } from '~/components/match/MatchCard';
import { supabase } from '~/lib/supabase';
import useStore from '~/store';
import { AIAgent } from '~/types/AIAgent';

export default function MatchScreen() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const activeIndex = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const user = useStore((state) => state.user);
  const { client } = useChatContext();

  useEffect(() => {
    async function fetchAgents() {
      const { data } = await supabase.from('ai_agents').select('*');
      setAgents(data as AIAgent[]);
    }
    fetchAgents();
  }, []);

  useAnimatedReaction(
    () => activeIndex.value,
    (value, prevValue) => {
      if (Math.floor(value) !== index) {
        runOnJS(setIndex)(Math.floor(value));
      }
    }
  );

  useEffect(() => {
    //if (index > agents.length - 3) {
    //console.warn('Last 2 cards remining. Fetch more!');
    //setAgents((usrs) => [...usrs, ....reverse()]);
    //}
    if (index === agents.length - 1) {
      console.log('Last card');
      setIndex(0);
    }
  }, [index]);

  const onMatch = async (res: boolean, agent: AIAgent) => {
    if (!user) {
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
    console.log('Channel created: ', channel);
    channel.watch();
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
