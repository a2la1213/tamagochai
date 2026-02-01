// src/hooks/useEmotion.ts
// Hook pour accéder au système émotionnel

import { useCallback, useMemo } from 'react';
import { useTamagochaiStore } from '../stores';
import { emotionService } from '../services/core';
import { EmotionType, EmotionState, EmotionIntensity } from '../types';
import { EMOTION_CONFIGS } from '../constants';
import { formatEmotionName } from '../utils';

/**
 * Hook pour accéder aux émotions du TamagochAI
 */
export function useEmotion() {
  const tamagochai = useTamagochaiStore(state => state.tamagochai);
  const refreshEmotion = useTamagochaiStore(state => state.refreshEmotion);

  // État émotionnel actuel
  const emotionState = tamagochai?.emotion ?? null;

  // Émotion primaire
  const primaryEmotion = emotionState?.primary ?? 'neutral';

  // Émotion secondaire
  const secondaryEmotion = emotionState?.secondary ?? null;

  // Intensité
  const intensity = emotionState?.intensity ?? 'moderate';

  // Configuration de l'émotion actuelle
  const emotionConfig = useMemo(() => {
    return EMOTION_CONFIGS[primaryEmotion];
  }, [primaryEmotion]);

  // Expression de l'avatar
  const expression = useMemo(() => {
    return emotionService.getExpression(primaryEmotion);
  }, [primaryEmotion]);

  // Emoji de l'émotion
  const emoji = useMemo(() => {
    return emotionService.getEmoji(primaryEmotion);
  }, [primaryEmotion]);

  // Couleur de l'émotion
  const color = useMemo(() => {
    return emotionService.getColor(primaryEmotion);
  }, [primaryEmotion]);

  // Description textuelle
  const description = useMemo(() => {
    if (!emotionState) return 'neutre';
    return emotionService.describeEmotion(emotionState);
  }, [emotionState]);

  // Est-ce une émotion positive ?
  const isPositive = useMemo(() => {
    return emotionService.isPositiveEmotion(primaryEmotion);
  }, [primaryEmotion]);

  // Est-ce une émotion négative ?
  const isNegative = useMemo(() => {
    return emotionService.isNegativeEmotion(primaryEmotion);
  }, [primaryEmotion]);

  // Valence (-1 à +1)
  const valence = emotionState?.valence ?? 0;

  // Arousal (0 à 1)
  const arousal = emotionState?.arousal ?? 0.5;

  // Stabilité émotionnelle
  const stability = useMemo(() => {
    return emotionService.calculateStability();
  }, [emotionState]);

  // Obtenir les infos d'une émotion spécifique
  const getEmotionInfo = useCallback((emotion: EmotionType) => {
    const config = EMOTION_CONFIGS[emotion];
    return {
      type: emotion,
      name: formatEmotionName(emotion),
      displayName: config.displayName,
      description: config.description,
      emoji: config.emoji,
      color: config.color,
      expression: config.expression,
      isPositive: emotionService.isPositiveEmotion(emotion),
      isNegative: emotionService.isNegativeEmotion(emotion),
    };
  }, []);

  // Obtenir l'intensité sous forme de pourcentage
  const intensityPercent = useMemo((): number => {
    const intensityMap: Record<EmotionIntensity, number> = {
      subtle: 25,
      moderate: 50,
      strong: 75,
      overwhelming: 100,
    };
    return intensityMap[intensity];
  }, [intensity]);

  // Obtenir un message contextuel basé sur l'émotion
  const getContextualMessage = useCallback((): string => {
    const messages: Record<EmotionType, string[]> = {
      neutral: ['Je suis calme.', 'Tout va bien.', 'Je suis serein.'],
      happy: ['Je suis content !', 'Ça me rend heureux !', 'J\'aime ça !'],
      sad: ['Je me sens un peu triste...', 'Ça me rend mélancolique.', 'J\'ai le cafard.'],
      angry: ['Ça m\'énerve un peu.', 'Je suis frustré.', 'Grr...'],
      scared: ['J\'ai un peu peur...', 'Ça m\'inquiète.', 'Je suis anxieux.'],
      loving: ['Je t\'aime bien !', 'Tu comptes pour moi.', 'Je me sens proche de toi.'],
      excited: ['Trop cool !', 'Je suis surexcité !', 'Wow !'],
      tired: ['Je suis fatigué...', 'J\'ai sommeil.', 'Je manque d\'énergie.'],
      curious: ['C\'est intéressant !', 'Je veux en savoir plus !', 'Hmm, curieux...'],
      confused: ['Je ne comprends pas bien...', 'C\'est confus.', 'Je suis perplexe.'],
    };

    const emotionMessages = messages[primaryEmotion];
    const randomIndex = Math.floor(Math.random() * emotionMessages.length);
    return emotionMessages[randomIndex];
  }, [primaryEmotion]);

  // Liste de toutes les émotions
  const allEmotions = useMemo(() => {
    return Object.keys(EMOTION_CONFIGS) as EmotionType[];
  }, []);

  return {
    // État
    state: emotionState,
    primary: primaryEmotion,
    secondary: secondaryEmotion,
    intensity,
    intensityPercent,
    valence,
    arousal,
    stability,

    // Affichage
    config: emotionConfig,
    expression,
    emoji,
    color,
    description,

    // Flags
    isPositive,
    isNegative,
    isNeutral: primaryEmotion === 'neutral',

    // Actions
    refresh: refreshEmotion,

    // Helpers
    getEmotionInfo,
    getContextualMessage,

    // Données
    allEmotions,
  };
}

export default useEmotion;
