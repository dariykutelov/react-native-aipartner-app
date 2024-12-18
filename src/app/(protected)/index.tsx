import { router } from 'expo-router';
import { ChannelList } from 'stream-chat-expo';

import useStore from '~/store';

export default function Home() {
  const setChannel = useStore((state) => state.setChannel);
  const filter = {
    members: {
      $in: ['14'],
    },
  };

  return (
    <ChannelList
      filters={filter} // only channels that I am a member of, otherwise errors due to lacking permissions
      onSelect={(channel) => {
        setChannel(channel);
        router.push('/channel');
      }}
    />
  );
}
