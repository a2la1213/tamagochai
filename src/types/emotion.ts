// src/types/emotion.ts
// Types pour le système émotionnel

/**
 * Types d'émotions possibles
 */
export type EmotionType =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'scared'
  | 'loving'
  | 'excited'
  | 'tired'
  | 'curious'
  | 'confused';

/**
 * Intensité de l'émotion
 */
export type EmotionIntensity = 'subtle' | 'moderate' | 'strong' | 'overwhelming';

/**
 * État émotionnel complet
 */
export interface EmotionState {
  primary: EmotionType;
  secondary: EmotionType | null;
  intensity: EmotionIntensity;
  valence: number;
  arousal: number;
  timestamp?: Date;
}

/**
 * Configuration d'une émotion
 */
export interface EmotionConfig {
  type: EmotionType;
  displayName: string;
  description: string;
  emoji: string;
  color: string;
  expression: string;
  valenceRange: [number, number];
  arousalRange: [number, number];
  hormoneInfluence: {
    primary: string;
    secondary?: string;
  };
}

/**
 * Transition émotionnelle
 */
export interface EmotionTransition {
  from: EmotionType;
  to: EmotionType;
  trigger: string;
  duration: number;
  timestamp: Date;
}
