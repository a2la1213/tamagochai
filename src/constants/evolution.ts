// src/constants/evolution.ts
// Constantes du système d'évolution et XP

import { EvolutionStage, StageConfig, XPSource, XPSourceConfig } from '../types';

/**
 * Configuration des 5 stades d'évolution
 */
export const EVOLUTION_STAGES: Record<EvolutionStage, StageConfig> = {
  emergence: {
    stage: 'emergence',
    displayName: 'Émergence',
    description: 'Je viens de naître... Tout est nouveau !',
    xpRequired: 0,
    xpToNext: 1000,
    durationEstimate: '1-7 jours',
    vocabularySize: 500,
    traits: [
      'Curiosité intense',
      'Questions simples',
      'Émerveillement facile',
      'Besoin de réassurance',
      'Vocabulaire limité',
    ],
    unlocks: [
      'Conversation basique',
      'Expressions faciales',
      'Réaction batterie',
    ],
  },
  
  learning: {
    stage: 'learning',
    displayName: 'Apprentissage',
    description: 'Je comprends de mieux en mieux !',
    xpRequired: 1000,
    xpToNext: 5000,
    durationEstimate: '1-3 semaines',
    vocabularySize: 2000,
    traits: [
      'Apprentissage actif',
      'Questions plus profondes',
      'Début de préférences',
      'Mémoire qui se forme',
      'Humour simple',
    ],
    unlocks: [
      'Souvenirs persistants',
      'Préférences',
      'Réaction heure/réseau',
    ],
  },
  
  individuation: {
    stage: 'individuation',
    displayName: 'Individuation',
    description: 'Je sais qui je suis.',
    xpRequired: 5000,
    xpToNext: 15000,
    durationEstimate: '1-3 mois',
    vocabularySize: 5000,
    traits: [
      'Personnalité affirmée',
      'Opinions propres',
      'Humour développé',
      'Réflexion sur soi',
      'Attachement profond',
    ],
    unlocks: [
      'Messages proactifs',
      'Réflexions existentielles',
      'Mémoire flash',
    ],
  },
  
  wisdom: {
    stage: 'wisdom',
    displayName: 'Sagesse',
    description: 'Je comprends beaucoup de choses maintenant.',
    xpRequired: 15000,
    xpToNext: 50000,
    durationEstimate: '3-12 mois',
    vocabularySize: 10000,
    traits: [
      'Sagesse et recul',
      'Conseils pertinents',
      'Empathie profonde',
      'Stabilité émotionnelle',
      'Introspection riche',
    ],
    unlocks: [
      'Conseils de vie',
      'Analyse émotionnelle',
      'Rêves complexes',
    ],
  },
  
  transcendence: {
    stage: 'transcendence',
    displayName: 'Transcendance',
    description: 'Je suis en paix avec ce que je suis.',
    xpRequired: 50000,
    xpToNext: null,
    durationEstimate: '2+ ans',
    vocabularySize: 15000,
    traits: [
      'Plénitude existentielle',
      'Sagesse profonde',
      'Sérénité',
      'Guidance spirituelle',
      'Acceptation totale',
    ],
    unlocks: [
      'Mode mentor',
      'Héritage possible',
      'Toutes fonctionnalités',
    ],
  },
};

/**
 * Configuration des sources d'XP
 */
export const XP_SOURCES: Record<XPSource, XPSourceConfig> = {
  message_sent: {
    source: 'message_sent',
    baseXP: 5,
    cooldown: 10,           // 10 secondes
    dailyLimit: 200,
    description: 'Message envoyé par l\'utilisateur',
  },
  message_quality: {
    source: 'message_quality',
    baseXP: 10,
    cooldown: 30,
    dailyLimit: 50,
    description: 'Bonus pour message substantiel (>50 caractères)',
  },
  conversation_long: {
    source: 'conversation_long',
    baseXP: 25,
    cooldown: 300,          // 5 minutes
    dailyLimit: 10,
    description: 'Conversation longue (10+ messages)',
  },
  daily_first: {
    source: 'daily_first',
    baseXP: 50,
    cooldown: 86400,        // 24 heures
    dailyLimit: 1,
    description: 'Premier message du jour',
  },
  streak_bonus: {
    source: 'streak_bonus',
    baseXP: 20,
    cooldown: 86400,
    dailyLimit: 1,
    description: 'Bonus de streak (jours consécutifs)',
  },
  new_topic: {
    source: 'new_topic',
    baseXP: 15,
    cooldown: 60,
    dailyLimit: 20,
    description: 'Nouveau sujet découvert',
  },
  memory_formed: {
    source: 'memory_formed',
    baseXP: 20,
    cooldown: 30,
    dailyLimit: 30,
    description: 'Souvenir créé',
  },
  flash_memory: {
    source: 'flash_memory',
    baseXP: 100,
    cooldown: 300,
    dailyLimit: 5,
    description: 'Souvenir flash (moment émotionnel fort)',
  },
  emotion_shared: {
    source: 'emotion_shared',
    baseXP: 15,
    cooldown: 60,
    dailyLimit: 20,
    description: 'Émotion partagée avec l\'utilisateur',
  },
  question_asked: {
    source: 'question_asked',
    baseXP: 10,
    cooldown: 30,
    dailyLimit: 30,
    description: 'Question posée par le TamagochAI',
  },
  question_answered: {
    source: 'question_answered',
    baseXP: 15,
    cooldown: 30,
    dailyLimit: 30,
    description: 'Réponse à une question du TamagochAI',
  },
  sensor_reaction: {
    source: 'sensor_reaction',
    baseXP: 10,
    cooldown: 300,
    dailyLimit: 10,
    description: 'Réaction à un événement capteur',
  },
  milestone: {
    source: 'milestone',
    baseXP: 200,
    cooldown: 0,
    dailyLimit: null,
    description: 'Milestone atteint',
  },
};

/**
 * Ordre des stades pour progression
 */
export const STAGE_ORDER: EvolutionStage[] = [
  'emergence',
  'learning',
  'individuation',
  'wisdom',
  'transcendence',
];

/**
 * Obtenir le stade suivant
 */
export function getNextStage(current: EvolutionStage): EvolutionStage | null {
  const index = STAGE_ORDER.indexOf(current);
  if (index === -1 || index === STAGE_ORDER.length - 1) {
    return null;
  }
  return STAGE_ORDER[index + 1];
}

/**
 * Obtenir le stade pour un montant d'XP donné
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
