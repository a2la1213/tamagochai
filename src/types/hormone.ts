// src/types/hormone.ts
// Système hormonal du TamagochAI

/**
 * Les 6 hormones du système
 */
export type HormoneType = 
  | 'dopamine'      // Plaisir, motivation, récompense
  | 'serotonin'     // Bien-être, stabilité, humeur
  | 'oxytocin'      // Attachement, confiance, lien social
  | 'cortisol'      // Stress, alerte, anxiété
  | 'adrenaline'    // Excitation, peur, énergie immédiate
  | 'endorphins';   // Bonheur, soulagement, euphorie

/**
 * Niveaux actuels de toutes les hormones (0-100)
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
 * Configuration d'une hormone
 */
export interface HormoneConfig {
  name: HormoneType;
  displayName: string;
  description: string;
  baseline: number;       // Niveau de base (repos)
  min: number;            // Minimum possible
  max: number;            // Maximum possible
  halfLife: number;       // Demi-vie en minutes
  decayRate: number;      // Taux de décroissance par tick
}

/**
 * Modificateur hormonal (appliqué lors d'événements)
 */
export interface HormoneModifier {
  hormone: HormoneType;
  delta: number;          // Changement (+/-)
  duration?: number;      // Durée en minutes (optionnel)
  source: string;         // Source du modificateur (ex: "user_message", "battery_low")
}

/**
 * Événement hormonal enregistré
 */
export interface HormoneEvent {
  id: string;
  timestamp: Date;
  modifiers: HormoneModifier[];
  trigger: string;        // Ce qui a déclenché l'événement
  levelsBefore: HormoneLevels;
  levelsAfter: HormoneLevels;
}

/**
 * État hormonal pour persistence
 */
export interface HormoneState {
  levels: HormoneLevels;
  lastUpdate: Date;
  lastDecay: Date;
}

/**
 * Seuils pour déterminer l'état d'une hormone
 */
export interface HormoneThresholds {
  critical_low: number;   // < 15
  low: number;            // < 30
  normal_low: number;     // < 45
  normal_high: number;    // < 65
  high: number;           // < 80
  critical_high: number;  // >= 80
}

/**
 * Niveau descriptif d'une hormone
 */
export type HormoneLevel = 
  | 'critical_low' 
  | 'low' 
  | 'normal' 
  | 'high' 
  | 'critical_high';

/**
 * Résumé de l'état hormonal pour affichage
 */
export interface HormoneSummary {
  dominant: HormoneType;
  dominantLevel: number;
  balance: 'stressed' | 'anxious' | 'calm' | 'happy' | 'excited' | 'neutral';
  alerts: HormoneType[];  // Hormones en niveau critique
}
