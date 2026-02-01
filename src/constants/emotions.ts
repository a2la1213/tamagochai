// src/constants/emotions.ts
// Constantes du système émotionnel

import { EmotionType, EmotionConfig, EmotionIntensity } from '../types';

/**
 * Configuration de chaque émotion
 */
export const EMOTION_CONFIGS: Record<EmotionType, EmotionConfig> = {
  neutral: {
    type: 'neutral',
    displayName: 'Neutre',
    description: 'État calme et équilibré',
    expression: 'neutral',
    valenceRange: [-0.2, 0.2],
    arousalRange: [0.3, 0.5],
    color: '#9CA3AF',
    emoji: '😐',
    hormoneInfluence: {
      primary: 'serotonin',
    },
  },
  happy: {
    type: 'happy',
    displayName: 'Joyeux',
    description: 'Sentiment de bonheur et satisfaction',
    expression: 'happy',
    valenceRange: [0.5, 1.0],
    arousalRange: [0.4, 0.7],
    color: '#10B981',
    emoji: '😊',
    hormoneInfluence: {
      primary: 'dopamine',
      secondary: 'serotonin',
    },
  },
  sad: {
    type: 'sad',
    displayName: 'Triste',
    description: 'Sentiment de mélancolie',
    expression: 'sad',
    valenceRange: [-1.0, -0.4],
    arousalRange: [0.1, 0.4],
    color: '#6366F1',
    emoji: '😢',
    hormoneInfluence: {
      primary: 'serotonin',
      secondary: 'cortisol',
    },
  },
  angry: {
    type: 'angry',
    displayName: 'En colère',
    description: 'Sentiment de frustration',
    expression: 'angry',
    valenceRange: [-0.8, -0.3],
    arousalRange: [0.6, 1.0],
    color: '#EF4444',
    emoji: '😠',
    hormoneInfluence: {
      primary: 'cortisol',
      secondary: 'adrenaline',
    },
  },
  scared: {
    type: 'scared',
    displayName: 'Effrayé',
    description: 'Sentiment de peur ou anxiété',
    expression: 'scared',
    valenceRange: [-0.9, -0.4],
    arousalRange: [0.7, 1.0],
    color: '#8B5CF6',
    emoji: '😨',
    hormoneInfluence: {
      primary: 'adrenaline',
      secondary: 'cortisol',
    },
  },
  loving: {
    type: 'loving',
    displayName: 'Aimant',
    description: 'Sentiment d\'affection profonde',
    expression: 'loving',
    valenceRange: [0.6, 1.0],
    arousalRange: [0.3, 0.6],
    color: '#EC4899',
    emoji: '🥰',
    hormoneInfluence: {
      primary: 'oxytocin',
      secondary: 'endorphins',
    },
  },
  excited: {
    type: 'excited',
    displayName: 'Excité',
    description: 'État d\'excitation et enthousiasme',
    expression: 'happy',
    valenceRange: [0.4, 0.9],
    arousalRange: [0.8, 1.0],
    color: '#F59E0B',
    emoji: '🤩',
    hormoneInfluence: {
      primary: 'dopamine',
      secondary: 'adrenaline',
    },
  },
  tired: {
    type: 'tired',
    displayName: 'Fatigué',
    description: 'État de fatigue et lassitude',
    expression: 'sad',
    valenceRange: [-0.3, 0.1],
    arousalRange: [0.0, 0.2],
    color: '#6B7280',
    emoji: '😴',
    hormoneInfluence: {
      primary: 'serotonin',
    },
  },
  curious: {
    type: 'curious',
    displayName: 'Curieux',
    description: 'Envie d\'apprendre et découvrir',
    expression: 'neutral',
    valenceRange: [0.2, 0.6],
    arousalRange: [0.5, 0.8],
    color: '#06B6D4',
    emoji: '🤔',
    hormoneInfluence: {
      primary: 'dopamine',
    },
  },
  confused: {
    type: 'confused',
    displayName: 'Confus',
    description: 'État de confusion ou perplexité',
    expression: 'neutral',
    valenceRange: [-0.2, 0.2],
    arousalRange: [0.4, 0.7],
    color: '#F97316',
    emoji: '😕',
    hormoneInfluence: {
      primary: 'cortisol',
    },
  },
};

/**
 * Mapping émotion -> expression avatar
 */
export const EMOTION_TO_EXPRESSION: Record<EmotionType, string> = {
  neutral: 'neutral',
  happy: 'happy',
  sad: 'sad',
  angry: 'angry',
  scared: 'scared',
  loving: 'loving',
  excited: 'happy',
  tired: 'sad',
  curious: 'neutral',
  confused: 'neutral',
};

/**
 * Seuils d'intensité émotionnelle
 */
export const EMOTION_INTENSITY_THRESHOLDS: Record<EmotionIntensity, number> = {
  subtle: 0.25,
  moderate: 0.5,
  strong: 0.75,
  overwhelming: 0.9,
};

/**
 * Émotions positives
 */
export const POSITIVE_EMOTIONS: EmotionType[] = [
  'happy',
  'loving',
  'excited',
  'curious',
];

/**
 * Émotions négatives
 */
export const NEGATIVE_EMOTIONS: EmotionType[] = [
  'sad',
  'angry',
  'scared',
  'confused',
];

/**
 * Émotions neutres
 */
export const NEUTRAL_EMOTIONS: EmotionType[] = [
  'neutral',
  'tired',
];
