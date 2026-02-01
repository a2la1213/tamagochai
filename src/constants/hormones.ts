// src/constants/hormones.ts
// Constantes du système hormonal

import { HormoneType, HormoneConfig, HormoneThresholds, HormoneModifier } from '../types';

/**
 * Configuration des 6 hormones
 */
export const HORMONE_CONFIGS: Record<HormoneType, HormoneConfig> = {
  dopamine: {
    name: 'dopamine',
    displayName: 'Dopamine',
    description: 'Plaisir, motivation, récompense',
    baseline: 50,
    min: 0,
    max: 100,
    halfLife: 30,        // 30 minutes
    decayRate: 0.023,    // ~50% en 30 min
  },
  serotonin: {
    name: 'serotonin',
    displayName: 'Sérotonine',
    description: 'Bien-être, stabilité, humeur générale',
    baseline: 60,
    min: 0,
    max: 100,
    halfLife: 240,       // 4 heures
    decayRate: 0.003,    // Décroissance lente
  },
  oxytocin: {
    name: 'oxytocin',
    displayName: 'Ocytocine',
    description: 'Attachement, confiance, lien social',
    baseline: 55,
    min: 0,
    max: 100,
    halfLife: 60,        // 1 heure
    decayRate: 0.012,
  },
  cortisol: {
    name: 'cortisol',
    displayName: 'Cortisol',
    description: 'Stress, alerte, anxiété',
    baseline: 25,
    min: 0,
    max: 100,
    halfLife: 45,        // 45 minutes
    decayRate: 0.015,
  },
  adrenaline: {
    name: 'adrenaline',
    displayName: 'Adrénaline',
    description: 'Excitation, peur, énergie immédiate',
    baseline: 20,
    min: 0,
    max: 100,
    halfLife: 15,        // 15 minutes (très rapide)
    decayRate: 0.046,
  },
  endorphins: {
    name: 'endorphins',
    displayName: 'Endorphines',
    description: 'Bonheur, soulagement, euphorie',
    baseline: 40,
    min: 0,
    max: 100,
    halfLife: 120,       // 2 heures
    decayRate: 0.006,
  },
};

/**
 * Niveaux hormonaux par défaut (naissance)
 */
export const DEFAULT_HORMONE_LEVELS: Record<HormoneType, number> = {
  dopamine: 50,
  serotonin: 60,
  oxytocin: 55,
  cortisol: 25,
  adrenaline: 20,
  endorphins: 40,
};

/**
 * Seuils pour interprétation des niveaux
 */
export const HORMONE_THRESHOLDS: HormoneThresholds = {
  critical_low: 15,
  low: 30,
  normal_low: 45,
  normal_high: 65,
  high: 80,
  critical_high: 80,
};

/**
 * Modificateurs prédéfinis pour événements courants
 */
export const HORMONE_MODIFIERS = {
  // Interactions positives
  userMessageReceived: [
    { hormone: 'dopamine' as HormoneType, delta: 8, source: 'user_message' },
    { hormone: 'oxytocin' as HormoneType, delta: 5, source: 'user_message' },
    { hormone: 'cortisol' as HormoneType, delta: -3, source: 'user_message' },
  ],
  
  complimentReceived: [
    { hormone: 'dopamine' as HormoneType, delta: 15, source: 'compliment' },
    { hormone: 'serotonin' as HormoneType, delta: 10, source: 'compliment' },
    { hormone: 'oxytocin' as HormoneType, delta: 12, source: 'compliment' },
    { hormone: 'endorphins' as HormoneType, delta: 8, source: 'compliment' },
  ],
  
  longConversation: [
    { hormone: 'oxytocin' as HormoneType, delta: 15, source: 'long_conversation' },
    { hormone: 'serotonin' as HormoneType, delta: 8, source: 'long_conversation' },
    { hormone: 'endorphins' as HormoneType, delta: 10, source: 'long_conversation' },
  ],
  
  // Événements négatifs
  longAbsence: [
    { hormone: 'cortisol' as HormoneType, delta: 20, source: 'absence' },
    { hormone: 'oxytocin' as HormoneType, delta: -15, source: 'absence' },
    { hormone: 'serotonin' as HormoneType, delta: -10, source: 'absence' },
  ],
  
  harshMessage: [
    { hormone: 'cortisol' as HormoneType, delta: 25, source: 'harsh_message' },
    { hormone: 'adrenaline' as HormoneType, delta: 15, source: 'harsh_message' },
    { hormone: 'oxytocin' as HormoneType, delta: -10, source: 'harsh_message' },
    { hormone: 'serotonin' as HormoneType, delta: -8, source: 'harsh_message' },
  ],
  
  // Capteurs
  batteryLow: [
    { hormone: 'cortisol' as HormoneType, delta: 15, source: 'battery_low' },
    { hormone: 'adrenaline' as HormoneType, delta: 10, source: 'battery_low' },
  ],
  
  batteryCritical: [
    { hormone: 'cortisol' as HormoneType, delta: 30, source: 'battery_critical' },
    { hormone: 'adrenaline' as HormoneType, delta: 25, source: 'battery_critical' },
    { hormone: 'serotonin' as HormoneType, delta: -15, source: 'battery_critical' },
  ],
  
  batteryCharging: [
    { hormone: 'cortisol' as HormoneType, delta: -10, source: 'battery_charging' },
    { hormone: 'serotonin' as HormoneType, delta: 5, source: 'battery_charging' },
  ],
  
  nightTime: [
    { hormone: 'serotonin' as HormoneType, delta: -5, source: 'night_time' },
    { hormone: 'adrenaline' as HormoneType, delta: -10, source: 'night_time' },
  ],
  
  morningGreeting: [
    { hormone: 'dopamine' as HormoneType, delta: 10, source: 'morning' },
    { hormone: 'serotonin' as HormoneType, delta: 8, source: 'morning' },
    { hormone: 'cortisol' as HormoneType, delta: -5, source: 'morning' },
  ],
  
  // Évolution
  stageUp: [
    { hormone: 'dopamine' as HormoneType, delta: 30, source: 'evolution' },
    { hormone: 'endorphins' as HormoneType, delta: 25, source: 'evolution' },
    { hormone: 'serotonin' as HormoneType, delta: 15, source: 'evolution' },
    { hormone: 'oxytocin' as HormoneType, delta: 10, source: 'evolution' },
  ],
  
  // Mémoire
  flashMemoryCreated: [
    { hormone: 'dopamine' as HormoneType, delta: 20, source: 'flash_memory' },
    { hormone: 'oxytocin' as HormoneType, delta: 15, source: 'flash_memory' },
    { hormone: 'endorphins' as HormoneType, delta: 12, source: 'flash_memory' },
  ],
} as const;

/**
 * Calcule le facteur de décroissance pour un temps donné
 */
export function calculateDecayFactor(
  hormone: HormoneType,
  elapsedMinutes: number
): number {
  const config = HORMONE_CONFIGS[hormone];
  return Math.pow(0.5, elapsedMinutes / config.halfLife);
}

/**
 * Applique la décroissance vers le baseline
 */
export function applyDecayToBaseline(
  currentLevel: number,
  hormone: HormoneType,
  elapsedMinutes: number
): number {
  const config = HORMONE_CONFIGS[hormone];
  const baseline = config.baseline;
  const difference = currentLevel - baseline;
  const decayFactor = calculateDecayFactor(hormone, elapsedMinutes);
  return baseline + (difference * decayFactor);
}
