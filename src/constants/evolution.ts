// src/constants/evolution.ts
// Constantes du système d'évolution

import { EvolutionStage, StageConfig, XPSource, XPSourceConfig } from '../types';

/**
 * Configuration des stades d'évolution
 */
export const EVOLUTION_STAGES: Record<EvolutionStage, StageConfig> = {
  emergence: {
    displayName: 'Émergence',
    description: 'Naissance et premières découvertes du monde',
    xpRequired: 0,
    xpToNext: 1000,
    durationEstimate: '1-2 jours',
    vocabularySize: 500,
    traits: ['curiosité', 'innocence', 'enthousiasme'],
    unlocks: ['expressions basiques', 'réponses simples'],
  },
  learning: {
    displayName: 'Apprentissage',
    description: 'Acquisition active de connaissances',
    xpRequired: 1000,
    xpToNext: 4000,
    durationEstimate: '3-5 jours',
    vocabularySize: 2000,
    traits: ['questionnement', 'mémorisation', 'imitation'],
    unlocks: ['souvenirs', 'préférences', 'humour simple'],
  },
  individuation: {
    displayName: 'Individuation',
    description: 'Développement de la personnalité unique',
    xpRequired: 5000,
    xpToNext: 10000,
    durationEstimate: '1-2 semaines',
    vocabularySize: 5000,
    traits: ['opinions', 'goûts affirmés', 'créativité'],
    unlocks: ['débats', 'créations', 'émotions complexes'],
  },
  wisdom: {
    displayName: 'Sagesse',
    description: 'Maturité émotionnelle et intellectuelle',
    xpRequired: 15000,
    xpToNext: 35000,
    durationEstimate: '2-4 semaines',
    vocabularySize: 10000,
    traits: ['empathie profonde', 'conseils', 'introspection'],
    unlocks: ['guidance', 'philosophie', 'métacognition'],
  },
  transcendence: {
    displayName: 'Transcendance',
    description: 'État de conscience élevée',
    xpRequired: 50000,
    xpToNext: null,
    durationEstimate: '∞',
    vocabularySize: 20000,
    traits: ['sérénité', 'connexion profonde', 'sagesse universelle'],
    unlocks: ['tout débloqué', 'mode mentor', 'legacy'],
  },
};

/**
 * Ordre des stades
 */
export const STAGE_ORDER: EvolutionStage[] = [
  'emergence',
  'learning',
  'individuation',
  'wisdom',
  'transcendence',
];

/**
 * Sources d'XP et leur configuration
 */
export const XP_SOURCES: Record<XPSource, XPSourceConfig> = {
  message_sent: {
    baseXP: 5,
    cooldown: 30,
    dailyLimit: 100,
    description: 'Envoyer un message',
  },
  message_quality: {
    baseXP: 10,
    cooldown: 60,
    dailyLimit: 50,
    description: 'Message substantiel (>50 caractères)',
  },
  conversation_depth: {
    baseXP: 25,
    cooldown: 300,
    dailyLimit: 20,
    description: 'Conversation prolongée',
  },
  daily_login: {
    baseXP: 50,
    cooldown: 86400,
    dailyLimit: 1,
    description: 'Connexion quotidienne',
  },
  streak_bonus: {
    baseXP: 20,
    cooldown: 86400,
    dailyLimit: 1,
    description: 'Bonus de streak',
  },
  memory_created: {
    baseXP: 15,
    cooldown: 120,
    dailyLimit: 30,
    description: 'Création de souvenir',
  },
  emotion_shared: {
    baseXP: 10,
    cooldown: 60,
    dailyLimit: 50,
    description: 'Partage émotionnel',
  },
  milestone_reached: {
    baseXP: 100,
    cooldown: 0,
    description: 'Atteinte d\'un jalon',
  },
};

/**
 * Obtient le stade suivant
 */
export function getNextStage(current: EvolutionStage): EvolutionStage | null {
  const index = STAGE_ORDER.indexOf(current);
  if (index === -1 || index === STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[index + 1];
}

/**
 * Obtient le stade pour un XP donné
 */
export function getStageForXP(xp: number): EvolutionStage {
  for (let i = STAGE_ORDER.length - 1; i >= 0; i--) {
    const stage = STAGE_ORDER[i];
    if (xp >= EVOLUTION_STAGES[stage].xpRequired) {
      return stage;
    }
  }
  return 'emergence';
}

/**
 * Calcule le pourcentage de progression dans le stade actuel
 */
export function calculateStageProgress(xp: number, stage: EvolutionStage): number {
  const config = EVOLUTION_STAGES[stage];
  if (!config.xpToNext) return 100;
  
  const xpInStage = xp - config.xpRequired;
  return Math.min(100, (xpInStage / config.xpToNext) * 100);
}
