// src/types/hormone.ts
// Types pour le système hormonal

/**
 * Types d'hormones
 */
export type HormoneType =
  | 'dopamine'
  | 'serotonin'
  | 'oxytocin'
  | 'cortisol'
  | 'adrenaline'
  | 'endorphins';

/**
 * Niveaux de toutes les hormones (0-100)
 */
export interface HormoneLevels {
  dopamine: number;
  serotonin: number;
  oxytocin: number;
  cortisol: number;
  adrenaline: number;
  endorphins: number;
}

/**
 * État hormonal complet
 */
export interface HormoneState {
  levels: HormoneLevels;
  lastUpdate: Date;
  lastDecay: Date;
}

/**
 * Configuration d'une hormone
 */
export interface HormoneConfig {
  name: string;
  displayName: string;
  description: string;
  baseline: number;
  decayRate: number;
  halfLife: number;
  min: number;
  max: number;
  effects: {
    low: string;
    high: string;
  };
}

/**
 * Modificateur d'hormone
 */
export interface HormoneModifier {
  hormone: HormoneType;
  delta: number;
  source: string;
  duration?: number;
}

/**
 * Historique d'hormone
 */
export interface HormoneHistory {
  timestamp: Date;
  levels: HormoneLevels;
  trigger?: string;
}

/**
 * Seuils hormonaux
 */
export interface HormoneThresholds {
  critical_low: number;
  low: number;
  normal_low: number;
  normal_high: number;
  high: number;
  critical_high: number;
}

/**
 * Résumé de l'état hormonal
 */
export interface HormoneSummary {
  dominant: HormoneType;
  dominantLevel: number;
  balanceState: 'balanced' | 'stressed' | 'happy' | 'low_energy';
  alerts: HormoneType[];
  levels: HormoneLevels;
}
