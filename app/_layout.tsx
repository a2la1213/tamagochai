// app/_layout.tsx
// Layout principal de l'application

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
    async function init() {
      try {
        // Initialiser la base de données
        await databaseService.initialize();
        
        // Initialiser le store TamagochAI
        await initialize();
        
        setIsReady(true);
      } catch (error) {
        console.error('[RootLayout] Initialization error:', error);
        setIsReady(true); // Continue anyway to show error state
      }
    }

    init();
  }, [initialize]);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
