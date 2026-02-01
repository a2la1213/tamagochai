// src/types/sensors.ts
// Types pour les capteurs du smartphone

/**
 * Types de capteurs
 */
export type SensorType = 'battery' | 'network' | 'time' | 'location';

/**
 * État de la batterie
 */
export interface BatteryState {
  level: number;
  isCharging: boolean;
  isLow: boolean;
  isCritical: boolean;
}

/**
 * État du réseau
 */
export interface NetworkState {
  isConnected: boolean;
  type: 'wifi' | 'cellular' | 'none';
  isInternetReachable: boolean;
}

/**
 * Contexte temporel
 */
export interface TimeContext {
  hour: number;
  minute: number;
  dayOfWeek: number;
  isWeekend: boolean;
  partOfDay: 'night' | 'morning' | 'afternoon' | 'evening';
  isNight: boolean;
}

/**
 * Contexte complet des capteurs
 */
export interface SensorContext {
  battery: BatteryState;
  network: NetworkState;
  time: TimeContext;
  lastUpdate: Date;
}

/**
 * Réaction aux capteurs
 */
export interface SensorReaction {
  sensor: SensorType;
  trigger: string;
  hormoneModifiers: { hormone: string; delta: number }[];
  message?: string;
}
