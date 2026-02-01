// src/types/evolution.ts
// Système d'évolution et XP du TamagochAI

/**
 * Les 5 stades d'évolution
 */
export type EvolutionStage =
  | 'emergence'      // Naissance, découverte (0-1000 XP)
  | 'learning'       // Apprentissage actif (1000-5000 XP)
  | 'individuation'  // Affirmation identité (5000-15000 XP)
  | 'wisdom'         // Sagesse, maturité (15000-50000 XP)
  | 'transcendence'; // Éveil, plénitude (50000+ XP)

/**
 * Configuration d'un stade
 */
export interface StageConfig {
  stage: EvolutionStage;
  displayName: string;
  description: string;
  xpRequired: number;           // XP minimum pour atteindre ce stade
  xpToNext: number | null;      // XP pour le stade suivant (null si dernier)
  durationEstimate: string;     // Estimation durée en mode production
  vocabularySize: number;       // Taille vocabulaire approximative
  traits: string[];             // Caractéristiques du stade
  unlocks: string[];            // Fonctionnalités débloquées
}

/**
 * Sources d'XP
 */
export type XPSource =
  | 'message_sent'           // Message envoyé par l'utilisateur
  | 'message_quality'        // Bonus pour message substantiel
  | 'conversation_long'      // Conversation longue (10+ messages)
  | 'daily_first'            // Premier message du jour
  | 'streak_bonus'           // Bonus de streak
  | 'new_topic'              // Nouveau sujet découvert
  | 'memory_formed'          // Souvenir créé
  | 'flash_memory'           // Souvenir flash (émotionnel fort)
  | 'emotion_shared'         // Émotion partagée avec l'utilisateur
  | 'question_asked'         // Question posée par le TamagochAI
  | 'question_answered'      // Réponse à une question du TamagochAI
  | 'sensor_reaction'        // Réaction à un capteur
  | 'milestone';             // Milestone atteint

/**
 * Configuration d'une source d'XP
 */
export interface XPSourceConfig {
  source: XPSource;
  baseXP: number;             // XP de base
  cooldown: number;           // Cooldown en secondes (anti-grind)
  dailyLimit: number | null;  // Limite quotidienne (null = illimité)
  description: string;
}

/**
 * Événement d'XP enregistré
 */
export interface XPEvent {
  id: string;
  source: XPSource;
  amount: number;             // XP gagné (après multiplicateur)
  baseAmount: number;         // XP de base (avant multiplicateur)
  multiplier: number;         // Multiplicateur appliqué
  timestamp: Date;
  metadata?: Record<string, any>; // Données supplémentaires
}

/**
 * Progression vers le prochain stade
 */
export interface EvolutionProgress {
  currentStage: EvolutionStage;
  currentXP: number;
  xpForCurrentStage: number;  // XP requis pour le stade actuel
  xpForNextStage: number | null;
  xpInCurrentStage: number;   // XP accumulé dans ce stade
  progressPercent: number;    // 0-100
  estimatedTimeToNext: string | null; // Estimation temps restant
}

/**
 * Événement de transition de stade
 */
export interface EvolutionEvent {
  id: string;
  fromStage: EvolutionStage;
  toStage: EvolutionStage;
  xpAtTransition: number;
  timestamp: Date;
  celebrationShown: boolean;  // Animation de célébration montrée
}

/**
 * Statistiques d'XP
 */
export interface XPStats {
  totalXP: number;
  todayXP: number;
  weekXP: number;
  monthXP: number;
  averageDailyXP: number;
  topSources: {
    source: XPSource;
    totalXP: number;
    count: number;
  }[];
}

/**
 * Anti-grind : tracking des cooldowns
 */
export interface XPCooldowns {
  [source: string]: {
    lastGrant: Date;
    countToday: number;
  };
}
