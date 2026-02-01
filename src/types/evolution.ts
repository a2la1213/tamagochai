// src/types/evolution.ts
// Types pour le système d'évolution et progression

/**
 * Stades d'évolution
 */
export type EvolutionStage =
  | 'emergence'      // 0-1000 XP : Naissance, découverte
  | 'learning'       // 1000-5000 XP : Apprentissage actif
  | 'individuation'  // 5000-15000 XP : Développement personnalité
  | 'wisdom'         // 15000-50000 XP : Maturité, sagesse
  | 'transcendence'; // 50000+ XP : Éveil, pleine conscience

/**
 * Configuration d'un stade
 */
export interface StageConfig {
  displayName: string;
  description: string;
  xpRequired: number;
  xpToNext: number | null; // null = stade final
  durationEstimate: string;
  vocabularySize: number;
  traits: string[];
  unlocks: string[];
}

/**
 * Sources d'XP
 */
export type XPSource =
  | 'message_sent'
  | 'message_quality'
  | 'conversation_depth'
  | 'daily_login'
  | 'streak_bonus'
  | 'memory_created'
  | 'emotion_shared'
  | 'milestone_reached';

/**
 * Configuration d'une source d'XP
 */
export interface XPSourceConfig {
  baseXP: number;
  cooldown: number; // secondes
  dailyLimit?: number;
  description: string;
}

/**
 * Événement XP
 */
export interface XPEvent {
  id: string;
  source: XPSource;
  amount: number;
  baseAmount: number;
  multiplier: number;
  metadata?: Record<string, any>;
  timestamp: Date;
}

/**
 * Progression d'évolution
 */
export interface EvolutionProgress {
  currentStage: EvolutionStage;
  currentXP: number;
  xpInCurrentStage: number;
  xpForNextStage: number | null;
  percentage: number;
  nextStage: EvolutionStage | null;
  estimatedDaysRemaining?: number;
}

/**
 * Mode de développement (pour multiplicateur XP)
 */
export type DevelopmentMode = 'debug' | 'development' | 'production';

/**
 * Multiplicateurs XP selon le mode
 */
export const XP_MULTIPLIERS: Record<DevelopmentMode, number> = {
  debug: 100,       // x100 pour tests rapides
  development: 10,  // x10 pour dev
  production: 1,    // x1 normal
};
