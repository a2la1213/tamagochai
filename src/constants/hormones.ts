// src/constants/hormones.ts
// Constantes du système hormonal

import { HormoneType, HormoneConfig, HormoneLevels, HormoneThresholds, HormoneModifier } from '../types';

/**
 * Configuration de chaque hormone
 */
export const HORMONE_CONFIGS: Record<HormoneType, HormoneConfig> = {
  dopamine: {
    name: 'dopamine',
    displayName: 'Dopamine',
    description: 'Motivation, récompense et plaisir',
    baseline: 50,
    min: 0,
    max: 100,
    halfLife: 30,
    decayRate: 0.02,
    effects: {
      low: 'Manque de motivation, apathie',
      high: 'Enthousiasme, excitation',
    },
  },
  serotonin: {
    name: 'serotonin',
    displayName: 'Sérotonine',
    description: 'Bien-être, stabilité émotionnelle',
    baseline: 60,
    min: 0,
    max: 100,
    halfLife: 45,
    decayRate: 0.015,
    effects: {
      low: 'Tristesse, irritabilité',
      high: 'Sérénité, optimisme',
    },
  },
  oxytocin: {
    name: 'oxytocin',
    displayName: 'Ocytocine',
    description: 'Attachement, lien social',
    baseline: 55,
    min: 0,
    max: 100,
    halfLife: 20,
    decayRate: 0.03,
    effects: {
      low: 'Sentiment de solitude',
      high: 'Affection, connexion',
    },
  },
  cortisol: {
    name: 'cortisol',
    displayName: 'Cortisol',
    description: 'Stress, vigilance',
    baseline: 25,
    min: 0,
    max: 100,
    halfLife: 60,
    decayRate: 0.01,
    effects: {
      low: 'Relaxation profonde',
      high: 'Stress, anxiété',
    },
  },
  adrenaline: {
    name: 'adrenaline',
    displayName: 'Adrénaline',
    description: 'Excitation, énergie immédiate',
    baseline: 20,
    min: 0,
    max: 100,
    halfLife: 10,
    decayRate: 0.05,
    effects: {
      low: 'Calme, léthargie',
      high: 'Alerte, nervosité',
    },
  },
  endorphins: {
    name: 'endorphins',
    displayName: 'Endorphines',
    description: 'Euphorie, bien-être physique',
    baseline: 40,
    min: 0,
    max: 100,
    halfLife: 25,
    decayRate: 0.025,
    effects: {
      low: 'Inconfort, sensibilité',
      high: 'Euphorie, analgésie',
    },
  },
};

/**
 * Seuils hormonaux
 */
export const HORMONE_THRESHOLDS: HormoneThresholds = {
  critical_low: 10,
  low: 25,
  normal_low: 45,
  normal_high: 65,
  high: 80,
  critical_high: 95,
};

/**
 * Niveaux par défaut
 */
export const DEFAULT_HORMONE_LEVELS: HormoneLevels = {
  dopamine: HORMONE_CONFIGS.dopamine.baseline,
  serotonin: HORMONE_CONFIGS.serotonin.baseline,
  oxytocin: HORMONE_CONFIGS.oxytocin.baseline,
  cortisol: HORMONE_CONFIGS.cortisol.baseline,
  adrenaline: HORMONE_CONFIGS.adrenaline.baseline,
  endorphins: HORMONE_CONFIGS.endorphins.baseline,
};

/**
 * Modificateurs d'hormones prédéfinis
 */
export const HORMONE_MODIFIERS = {
  userMessageReceived: [
    { hormone: 'dopamine' as HormoneType, delta: 8, source: 'user_message' },
    { hormone: 'oxytocin' as HormoneType, delta: 5, source: 'user_message' },
    { hormone: 'serotonin' as HormoneType, delta: 3, source: 'user_message' },
  ],
  positiveInteraction: [
    { hormone: 'dopamine' as HormoneType, delta: 12, source: 'positive_interaction' },
    { hormone: 'serotonin' as HormoneType, delta: 8, source: 'positive_interaction' },
    { hormone: 'endorphins' as HormoneType, delta: 6, source: 'positive_interaction' },
  ],
  negativeInteraction: [
    { hormone: 'cortisol' as HormoneType, delta: 15, source: 'negative_interaction' },
    { hormone: 'serotonin' as HormoneType, delta: -10, source: 'negative_interaction' },
    { hormone: 'dopamine' as HormoneType, delta: -8, source: 'negative_interaction' },
  ],
  longAbsence: [
    { hormone: 'oxytocin' as HormoneType, delta: -20, source: 'long_absence' },
    { hormone: 'serotonin' as HormoneType, delta: -10, source: 'long_absence' },
    { hormone: 'cortisol' as HormoneType, delta: 10, source: 'long_absence' },
  ],
  batteryLow: [
    { hormone: 'cortisol' as HormoneType, delta: 10, source: 'battery_low' },
    { hormone: 'adrenaline' as HormoneType, delta: 5, source: 'battery_low' },
  ],
  batteryCritical: [
    { hormone: 'cortisol' as HormoneType, delta: 20, source: 'battery_critical' },
    { hormone: 'adrenaline' as HormoneType, delta: 15, source: 'battery_critical' },
    { hormone: 'serotonin' as HormoneType, delta: -10, source: 'battery_critical' },
  ],
  batteryCharging: [
    { hormone: 'cortisol' as HormoneType, delta: -10, source: 'battery_charging' },
    { hormone: 'serotonin' as HormoneType, delta: 5, source: 'battery_charging' },
  ],
  nightTime: [
    { hormone: 'adrenaline' as HormoneType, delta: -10, source: 'night_time' },
    { hormone: 'serotonin' as HormoneType, delta: -5, source: 'night_time' },
  ],
  morningGreeting: [
    { hormone: 'dopamine' as HormoneType, delta: 10, source: 'morning_greeting' },
    { hormone: 'serotonin' as HormoneType, delta: 8, source: 'morning_greeting' },
    { hormone: 'cortisol' as HormoneType, delta: 5, source: 'morning_greeting' },
  ],
  memoryCreated: [
    { hormone: 'dopamine' as HormoneType, delta: 10, source: 'memory_created' },
    { hormone: 'oxytocin' as HormoneType, delta: 8, source: 'memory_created' },
  ],
  flashMemory: [
    { hormone: 'dopamine' as HormoneType, delta: 20, source: 'flash_memory' },
    { hormone: 'endorphins' as HormoneType, delta: 15, source: 'flash_memory' },
    { hormone: 'oxytocin' as HormoneType, delta: 10, source: 'flash_memory' },
  ],
} as const;

/**
 * Calcule le facteur de décroissance
 */
export function calculateDecayFactor(hormone: HormoneType, elapsedMinutes: number): number {
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
  const diff = currentLevel - baseline;
  const decayFactor = calculateDecayFactor(hormone, elapsedMinutes);
  return baseline + diff * decayFactor;
}
