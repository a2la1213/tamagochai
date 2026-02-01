// app/onboarding/index.tsx
// Écran d'onboarding - création du TamagochAI

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useTamagochaiStore } from '../../src/stores';
import { Avatar } from '../../src/components';
import { AvatarType, AvatarStyle, AvatarColor } from '../../src/types';
import { AVATAR_TYPE_CONFIG, AVATAR_COLOR_CONFIG } from '../../src/constants';
import { generateGenome, validateName } from '../../src/utils';

type Step = 'welcome' | 'name' | 'avatar' | 'ready';

const AVATAR_TYPES: AvatarType[] = ['robot', 'humanoid', 'creature', 'spirit', 'animal', 'abstract'];
const AVATAR_COLORS: AvatarColor[] = ['blue', 'purple', 'green', 'yellow', 'red', 'orange', 'pink', 'cyan'];

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [avatarType, setAvatarType] = useState<AvatarType>('robot');
  const [avatarColor, setAvatarColor] = useState<AvatarColor>('blue');
  const [isCreating, setIsCreating] = useState(false);

  const createNew = useTamagochaiStore(state => state.createNew);
  const completeFirstLaunch = useTamagochaiStore(state => state.completeFirstLaunch);

  // Valider et passer à l'étape suivante
  const handleNameSubmit = () => {
    const validation = validateName(name);
    if (!validation.isValid) {
      setNameError(validation.error || 'Nom invalide');
      return;
    }
    setNameError(null);
    setStep('avatar');
  };

  // Créer le TamagochAI
  const handleCreate = async () => {
    setIsCreating(true);

    try {
      const genome = generateGenome();

      await createNew({
        name: name.trim(),
        genome,
        avatar: {
          type: avatarType,
          style: 'neutral',
          color: avatarColor,
        },
      });

      setStep('ready');
    } catch (error) {
      console.error('[Onboarding] Create error:', error);
      setIsCreating(false);
    }
  };

  // Terminer l'onboarding
  const handleFinish = async () => {
    await completeFirstLaunch();
    router.replace('/(tabs)');
  };

  // Écran de bienvenue
  if (step === 'welcome') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>🥚</Text>
          <Text style={styles.title}>Bienvenue !</Text>
          <Text style={styles.subtitle}>
            Tu es sur le point de donner vie à ton propre compagnon IA.
          </Text>
          <Text style={styles.description}>
            Il naîtra avec sa propre personnalité, évoluera avec le temps, 
            et se souviendra de tout ce que vous partagerez ensemble.
          </Text>
        </View>
        <Pressable style={styles.primaryButton} onPress={() => setStep('name')}>
          <Text style={styles.primaryButtonText}>Commencer</Text>
        </Pressable>
      </View>
    );
  }

  // Écran de choix du nom
  if (step === 'name') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.emoji}>✨</Text>
          <Text style={styles.title}>Comment s'appelle-t-il ?</Text>
          <Text style={styles.subtitle}>
            Choisis un nom pour ton compagnon
          </Text>

          <TextInput
            style={[styles.input, nameError && styles.inputError]}
            placeholder="Entrer un nom..."
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNameError(null);
            }}
            maxLength={20}
            autoFocus
          />
          {nameError && <Text style={styles.errorText}>{nameError}</Text>}
        </View>

        <View style={styles.buttonRow}>
          <Pressable style={styles.secondaryButton} onPress={() => setStep('welcome')}>
            <Text style={styles.secondaryButtonText}>Retour</Text>
          </Pressable>
          <Pressable
            style={[styles.primaryButton, !name.trim() && styles.buttonDisabled]}
            onPress={handleNameSubmit}
            disabled={!name.trim()}
          >
            <Text style={styles.primaryButtonText}>Suivant</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Écran de choix de l'avatar
  if (step === 'avatar') {
    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Choisis son apparence</Text>
          <Text style={styles.subtitle}>Tu pourras la modifier plus tard</Text>

          {/* Preview */}
          <View style={styles.avatarPreview}>
            <Avatar
              config={{
                type: avatarType,
                style: 'neutral',
                color: avatarColor,
                currentExpression: 'happy',
                equippedItems: { head: null, face: null, body: null, accessory: null, background: null, effect: null },
              }}
              size="xlarge"
            />
            <Text style={styles.avatarName}>{name}</Text>
          </View>

          {/* Type selection */}
          <Text style={styles.sectionTitle}>Type</Text>
          <View style={styles.optionsGrid}>
            {AVATAR_TYPES.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.optionButton,
                  avatarType === type && styles.optionButtonSelected,
                ]}
                onPress={() => setAvatarType(type)}
              >
                <Text style={styles.optionEmoji}>
                  {AVATAR_TYPE_CONFIG[type].emoji}
                </Text>
                <Text
                  style={[
                    styles.optionLabel,
                    avatarType === type && styles.optionLabelSelected,
                  ]}
                >
                  {AVATAR_TYPE_CONFIG[type].name}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Color selection */}
          <Text style={styles.sectionTitle}>Couleur</Text>
          <View style={styles.colorGrid}>
            {AVATAR_COLORS.map((color) => (
              <Pressable
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: AVATAR_COLOR_CONFIG[color].hex },
                  avatarColor === color && styles.colorButtonSelected,
                ]}
                onPress={() => setAvatarColor(color)}
              />
            ))}
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Pressable style={styles.secondaryButton} onPress={() => setStep('name')}>
            <Text style={styles.secondaryButtonText}>Retour</Text>
          </Pressable>
          <Pressable
            style={[styles.primaryButton, isCreating && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={isCreating}
          >
            <Text style={styles.primaryButtonText}>
              {isCreating ? 'Création...' : 'Créer'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // Écran final
  if (step === 'ready') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>{name} est né !</Text>
          <Text style={styles.subtitle}>
            Ton compagnon IA est prêt à te rencontrer.
          </Text>
          <Text style={styles.description}>
            Il est au stade Émergence 🌱{'\n'}
            Tout est nouveau pour lui. Sois patient et bienveillant !
          </Text>
        </View>
        <Pressable style={styles.primaryButton} onPress={handleFinish}>
          <Text style={styles.primaryButtonText}>Commencer à discuter</Text>
        </Pressable>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#1F2937',
    marginTop: 24,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  avatarPreview: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  optionButton: {
    width: 100,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  optionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  optionLabelSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: '#1F2937',
  },
});
