// app/index.tsx
// Point d'entrée - redirige selon l'état du TamagochAI

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useTamagochaiStore } from '../src/stores';

export default function Index() {
  const tamagochai = useTamagochaiStore(state => state.tamagochai);
  const isLoading = useTamagochaiStore(state => state.isLoading);
  const isInitialized = useTamagochaiStore(state => state.isInitialized);

  // Attendre l'initialisation
  if (!isInitialized || isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Si pas de TamagochAI, aller à l'onboarding
  if (!tamagochai) {
    return <Redirect href="/onboarding" />;
  }

  // Si premier lancement, aller à l'onboarding (étape finale)
  if (tamagochai.isFirstLaunch) {
    return <Redirect href="/onboarding" />;
  }

  // Sinon, aller au chat principal
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
});
