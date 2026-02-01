// app/index.tsx
// Écran d'entrée - redirige selon l'état

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useTamagochaiStore } from '../src/stores';

export default function IndexScreen() {
  const isInitialized = useTamagochaiStore(state => state.isInitialized);
  const isFirstLaunch = useTamagochaiStore(state => state.isFirstLaunch);
  const tamagochai = useTamagochaiStore(state => state.tamagochai);

  // En cours de chargement
  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Premier lancement ou pas de TamagochAI -> Onboarding
  if (isFirstLaunch || !tamagochai) {
    return <Redirect href="/onboarding" />;
  }

  // TamagochAI existe -> Chat
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
