// src/constants/emotions.ts
// Constantes du système émotionnel

import { EmotionType, EmotionConfig, AvatarExpression } from '../types';

/**
 * Configuration des émotions
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
  },
  happy: {
    type: 'happy',
    displayName: 'Heureux',
    description: 'Joie et contentement',
    expression: 'happy',
    valenceRange: [0.5, 1.0],
    arousalRange: [0.4, 0.7],
    color: '#22C55E',
    emoji: '😊',
  },
  sad: {
    type: 'sad',
    displayName: 'Triste',
    description: 'Tristesse et mélancolie',
    expression: 'sad',
    valenceRange: [-1.0, -0.4],
    arousalRange: [0.1, 0.4],
    color: '#3B82F6',
    emoji: '😢',
  },
  angry: {
    type: 'angry',
    displayName: 'En colère',
    description: 'Colère et frustration',
    expression: 'angry',
    valenceRange: [-0.8, -0.3],
    arousalRange: [0.6, 1.0],
    color: '#EF4444',
    emoji: '😠',
  },
  scared: {
    type: 'scared',
    displayName: 'Effrayé',
    description: 'Peur et anxiété',
    expression: 'scared',
    valenceRange: [-0.9, -0.4],
    arousalRange: [0.7, 1.0],
    color: '#8B5CF6',
    emoji: '😨',
  },
  loving: {
    type: 'loving',
    displayName: 'Aimant',
    description: 'Amour et affection',
    expression: 'loving',
    valenceRange: [0.6, 1.0],
    arousalRange: [0.3, 0.6],
    color: '#EC4899',
    emoji: '🥰',
  },
  excited: {
    type: 'excited',
    displayName: 'Excité',
    description: 'Excitation et enthousiasme',
    expression: 'happy',
    valenceRange: [0.4, 0.9],
    arousalRange: [0.8, 1.0],
    color: '#F97316',
    emoji: '🤩',
  },
  tired: {
    type: 'tired',
    displayName: 'Fatigué',
    description: 'Fatigue et épuisement',
    expression: 'sad',
    valenceRange: [-0.3, 0.1],
    arousalRange: [0.0, 0.2],
    color: '#6B7280',
    emoji: '😴',
  },
  curious: {
    type: 'curious',
    displayName: 'Curieux',
    description: 'Curiosité et intérêt',
    expression: 'neutral',
    valenceRange: [0.2, 0.6],
    arousalRange: [0.5, 0.8],
    color: '#06B6D4',
    emoji: '🤔',
  },
  confused: {
    type: 'confused',
    displayName: 'Confus',
    description: 'Confusion et perplexité',
    expression: 'neutral',
    valenceRange: [-0.2, 0.2],
    arousalRange: [0.4, 0.7],
    color: '#EAB308',
    emoji: '😕',
  },
};

/**
 * Mapping émotion → expression avatar
 */
export const EMOTION_TO_EXPRESSION: Record<EmotionType, AvatarExpression> = {
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
export const EMOTION_INTENSITY_THRESHOLDS = {
  subtle: 0.25,
  moderate: 0.5,
  strong: 0.75,
  overwhelming: 0.9,
} as const;

/**
 * Calcul de l'émotion basé sur les hormones
 * Formules simplifiées pour le MVP
 */
export const EMOTION_FORMULAS = {
  // Joie = (dopamine × 0.4 + sérotonine × 0.4 + endorphines × 0.2) × (1 - cortisol/200)
  happy: {
    weights: {
      dopamine: 0.4,
      serotonin: 0.4,
      endorphins: 0.2,
    },
    cortisolPenalty: 200,
  },
  
  // Tristesse = max(0, 60 - sérotonine) × 0.5 + max(0, 50 - dopamine) × 0.3 + cortisol × 0.2
  sad: {
    serotoninThreshold: 60,
    serotoninWeight: 0.5,
    dopamineThreshold: 50,
    dopamineWeight: 0.3,
    cortisolWeight: 0.2,
  },
  
  // Peur = adrénaline × 0.5 + cortisol × 0.4 + max(0, 50 - ocytocine) × 0.1
  scared: {
    adrenalineWeight: 0.5,
    cortisolWeight: 0.4,
    oxytocinThreshold: 50,
    oxytocinWeight: 0.1,
  },
  
  // Amour = ocytocine × 0.7 + endorphines × 0.2 + sérotonine × 0.1
  loving: {
    oxytocinWeight: 0.7,
    endorphinsWeight: 0.2,
    serotoninWeight: 0.1,
  },
  
  // Colère = cortisol × 0.4 + adrénaline × 0.3 + max(0, 40 - sérotonine) × 0.3
  angry: {
    cortisolWeight: 0.4,
    adrenalineWeight: 0.3,
    serotoninThreshold: 40,
    serotoninWeight: 0.3,
  },
  
  // Excitation = dopamine × 0.4 + adrénaline × 0.4 + endorphines × 0.2
  excited: {
    dopamineWeight: 0.4,
    adrenalineWeight: 0.4,
    endorphinsWeight: 0.2,
  },
} as const;

/**
 * Durée minimale d'une émotion avant changement (ms)
 */
export const EMOTION_MIN_DURATION = 5000;

/**
 * Durée de transition entre émotions (ms)
 */
export const EMOTION_TRANSITION_DURATION = 500;

/**
 * Liste des émotions positives
 */
export const POSITIVE_EMOTIONS: EmotionType[] = [
  'happy',
  'loving',
  'excited',
  'curious',
];

/**
 * Liste des émotions négatives
 */
export const NEGATIVE_EMOTIONS: EmotionType[] = [
  'sad',
  'angry',
  'scared',
  'tired',
];

/**
 * Liste des émotions neutres
 */
export const NEUTRAL_EMOTIONS: EmotionType[] = [
  'neutral',
  'confused',
];
