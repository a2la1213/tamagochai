// app/_layout.tsx
// Root layout avec navigation

import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { databaseService } from '../src/services/database';
import { useTamagochaiStore } from '../src/stores';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const initialize = useTamagochaiStore(state => state.initialize);

  useEffect(() => {
    const init = async () => {
      try {
        await databaseService.initialize();
        await initialize();
        setIsReady(true);
      } catch (error) {
        console.error('[RootLayout] Init error:', error);
        setIsReady(true);
      }
    };

    init();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
