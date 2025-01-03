import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import useStore from '~/store';
import { getStoredGender } from '~/utils/genderStorage';

export default function Home() {
  const session = useStore((state) => state.session);
  const initializeAuth = useStore((state) => state.initializeAuth);
  const isLoading = useStore((state) => state.isLoading);
  const [hasGender, setHasGender] = useState<boolean | null>(null);

  useEffect(() => {
    initializeAuth();
    checkGender();
  }, [initializeAuth]);

  const checkGender = async () => {
    const gender = await getStoredGender();
    setHasGender(!!gender);
  };

  if (isLoading || hasGender === null) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!session) {
    if (!hasGender) {
      return <Redirect href="/onboarding" />;
    } else {
      return <Redirect href="/signin" />;
    }
  } else {
    return <Redirect href="/(protected)" />;
  }
}
