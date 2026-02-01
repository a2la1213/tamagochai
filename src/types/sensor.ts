// src/types/sensor.ts
// Types pour les capteurs du smartphone (corps du TamagochAI)

/**
 * Types de capteurs disponibles
 */
export type SensorType =
  | 'battery'       // Niveau de batterie
  | 'charging'      // En charge ou non
  | 'time'          // Heure actuelle
  | 'network'       // État du réseau
  | 'light'         // Luminosité ambiante (v2)
  | 'motion'        // Mouvement/accéléromètre (v2)
  | 'location';     // Localisation (v2)

/**
 * État de la batterie
 */
export interface BatteryState {
  level: number;              // 0-100
  isCharging: boolean;
  isLow: boolean;             // < 20%
  isCritical: boolean;        // < 10%
  timeToEmpty?: number;       // Minutes estimées
  timeToFull?: number;        // Minutes si en charge
}

/**
 * État du réseau
 */
export interface NetworkState {
  isConnected: boolean;
  type: 'wifi' | 'cellular' | 'none';
  isInternetReachable: boolean;
  strength?: number;          // Force du signal 0-100
}

/**
 * Contexte temporel
 */
export interface TimeContext {
  hour: number;               // 0-23
  minute: number;
  dayOfWeek: number;          // 0=Dimanche, 6=Samedi
  isWeekend: boolean;
  partOfDay: 'night' | 'morning' | 'afternoon' | 'evening';
  isNight: boolean;           // 22h-6h
}

/**
 * Contexte complet des capteurs
 */
export interface SensorContext {
  battery: BatteryState;
  network: NetworkState;
  time: TimeContext;
  lastUpdate: Date;
  
  // V2 - optionnels
  light?: {
    level: number;            // 0-100
    isDark: boolean;
  };
  motion?: {
    isMoving: boolean;
    activity: 'stationary' | 'walking' | 'running' | 'driving';
  };
  location?: {
    isHome: boolean;
    isWork: boolean;
    placeName?: string;
  };
}

/**
 * Événement capteur (déclenche réaction)
 */
export interface SensorEvent {
  id: string;
  type: SensorType;
  trigger: string;            // Ce qui a déclenché l'événement
  data: Record<string, any>;
  timestamp: Date;
  
  // Réaction du TamagochAI
  reacted: boolean;
  reactionType?: 'message' | 'emotion_change' | 'hormone_change';
  reactionContent?: string;
}

/**
 * Seuils de réaction aux capteurs
 */
export interface SensorThresholds {
  battery: {
    low: number;              // Seuil batterie basse (20)
    critical: number;         // Seuil critique (10)
    full: number;             // Seuil plein (100)
  };
  time: {
    nightStart: number;       // Heure début nuit (22)
    nightEnd: number;         // Heure fin nuit (6)
    morningStart: number;     // Début matin (6)
    afternoonStart: number;   // Début après-midi (12)
    eveningStart: number;     // Début soirée (18)
  };
}

/**
 * Configuration des réactions aux capteurs
 */
export interface SensorReactionConfig {
  enabled: boolean;
  cooldown: number;           // Cooldown entre réactions (minutes)
  quietHoursEnabled: boolean;
  quietHoursStart: number;    // Heure début silence (22)
  quietHoursEnd: number;      // Heure fin silence (8)
}

/**
 * Réaction possible à un événement capteur
 */
export interface SensorReaction {
  sensorType: SensorType;
  trigger: string;
  possibleMessages: string[];
  hormoneModifiers: {
    hormone: string;
    delta: number;
  }[];
  emotionTrigger?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Statistiques capteurs
 */
export interface SensorStats {
  averageBatteryLevel: number;
  lowBatteryCount: number;    // Fois où batterie < 20%
  criticalBatteryCount: number;
  mostActiveHours: number[];  // Heures avec le plus d'interactions
  weekdayVsWeekend: {
    weekdayMessages: number;
    weekendMessages: number;
  };
}
