// src/types/emotion.ts
// Système émotionnel du TamagochAI

/**
 * Les émotions de base (mappées aux expressions avatar)
 */
export type EmotionType =
  | 'neutral'    // État par défaut
  | 'happy'      // Joie, contentement
  | 'sad'        // Tristesse, mélancolie
  | 'angry'      // Colère, frustration
  | 'scared'     // Peur, anxiété
  | 'loving'     // Amour, affection, tendresse
  | 'excited'    // Excitation, enthousiasme
  | 'tired'      // Fatigue, épuisement
  | 'curious'    // Curiosité, intérêt
  | 'confused';  // Confusion, perplexité

/**
 * Intensité d'une émotion
 */
export type EmotionIntensity = 'subtle' | 'moderate' | 'strong' | 'overwhelming';

/**
 * État émotionnel complet
 */
export interface EmotionState {
  primary: EmotionType;           // Émotion dominante
  secondary: EmotionType | null;  // Émotion secondaire (nuance)
  intensity: EmotionIntensity;
  valence: number;                // -1 (négatif) à +1 (positif)
  arousal: number;                // 0 (calme) à 1 (excité)
  timestamp: Date;
}

/**
 * Mapping émotion → expression avatar
 */
export type AvatarExpression = 'neutral' | 'happy' | 'sad' | 'angry' | 'scared' | 'loving';

/**
 * Configuration d'une émotion
 */
export interface EmotionConfig {
  type: EmotionType;
  displayName: string;
  description: string;
  expression: AvatarExpression;   // Expression avatar correspondante
  valenceRange: [number, number]; // Plage de valence typique
  arousalRange: [number, number]; // Plage d'arousal typique
  color: string;                  // Couleur pour UI
  emoji: string;                  // Emoji représentatif
}

/**
 * Transition émotionnelle
 */
export interface EmotionTransition {
  from: EmotionState;
  to: EmotionState;
  trigger: string;      // Ce qui a causé la transition
  timestamp: Date;
  duration: number;     // Durée de transition en ms
}

/**
 * Calcul d'émotion basé sur les hormones
 */
export interface EmotionCalculation {
  emotion: EmotionType;
  confidence: number;   // 0-1, certitude du calcul
  factors: {
    hormone: string;
    contribution: number;
  }[];
}

/**
 * Historique émotionnel pour analyse
 */
export interface EmotionHistory {
  emotion: EmotionType;
  intensity: EmotionIntensity;
  timestamp: Date;
  duration: number;     // Durée en minutes
}

/**
 * Résumé émotionnel pour une période
 */
export interface EmotionSummary {
  dominantEmotion: EmotionType;
  emotionDistribution: Record<EmotionType, number>; // Pourcentage de temps
  averageValence: number;
  averageArousal: number;
  moodStability: number; // 0-1, stabilité de l'humeur
}
