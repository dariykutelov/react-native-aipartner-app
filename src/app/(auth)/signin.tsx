import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { AppleSignIn } from '~/components/authentication/AppleSignin';
import useStore from '~/store';

export default function SignIn() {
  const session = useStore((state) => state.session);

  if (session) {
    return <Redirect href="/(protected)" />;
  }

  return (
    <View className="flex-1 items-center justify-center p-5">
      <AppleSignIn />
    </View>
  );
}
