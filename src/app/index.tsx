import { Redirect, RelativePathString } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

import useStore from '~/store';

export default function Home() {
  const session = useStore((state) => state.session);
  const initializeAuth = useStore((state) => state.initializeAuth);
  const isLoading = useStore((state) => state.isLoading);
  const isOnboardingComplete = useStore((state) => state.isOnboardingComplete);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!session) {
    if (!isOnboardingComplete) {
      return <Redirect href={'/(auth)/onboarding' as RelativePathString} />;
    } else {
      return <Redirect href="/(auth)/signin" />;
    }
  } else {
    return <Redirect href="/(protected)" />;
  }
}
