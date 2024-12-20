import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useAnimatedReaction, useSharedValue, runOnJS } from 'react-native-reanimated';

import { MatchCard } from '~/components/match/MatchCard';
import { supabase } from '~/lib/supabase';
import { AIAgent } from '~/types/AIAgent';

export default function MatchScreen() {
  const [users, setUsers] = useState<AIAgent[]>([]);
  const activeIndex = useSharedValue(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function fetchAgents() {
      const { data } = await supabase.from('ai_agents').select('*');
      console.log('data: ', data);
      setUsers(data as AIAgent[]);
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

  //   useEffect(() => {
  //     if (index > users.length - 3) {
  //       console.warn('Last 2 cards remining. Fetch more!');
  //       setUsers((usrs) => [...usrs, ...dummuUsers.reverse()]);
  //     }
  //   }, [index]);

  const onResponse = (res: boolean) => {
    console.log('on Response: ', res);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Stack.Screen options={{ headerShown: false }} />
      {users.map((user, index) => (
        <MatchCard
          key={`${user.id}-${index}`}
          user={user}
          numOfCards={users.length}
          index={index}
          activeIndex={activeIndex}
          onResponse={onResponse}
        />
      ))}
    </View>
  );
}
