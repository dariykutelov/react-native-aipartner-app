import '../../global.css';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OverlayProvider } from 'stream-chat-expo';

import useStore from '~/store';

export default function Layout() {
  const initializeAuth = useStore((state) => state.initializeAuth);
  const isLoading = useStore((state) => state.isLoading);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OverlayProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </OverlayProvider>
    </GestureHandlerRootView>
  );
}
