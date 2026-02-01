// src/constants/app.ts
// Constantes de configuration de l'application

import { DevelopmentMode } from '../types';

/**
 * Configuration globale de l'application
 */
export const APP_CONFIG = {
  // Informations de l'app
  name: 'TamagochAI',
  version: '0.1.0',
  
  // Mode de développement (affecte les multiplicateurs XP)
  developmentMode: 'development' as DevelopmentMode,
  
  // Limites
  maxMessageLength: 2000,
  maxNameLength: 20,
  minNameLength: 2,
  
  // Timings (en ms)
  autoSaveInterval: 30000,
  hormoneDecayInterval: 60000,
  
  // Stockage
  database: {
    name: 'tamagochai.db',
    version: 1,
  },
  
  // Debug
  enableLogs: __DEV__ ?? true,
  enablePerformanceMetrics: false,
};

/**
 * Configuration des messages
 */
export const MESSAGE_CONFIG = {
  maxLength: 2000,
  minLength: 1,
  typingDelay: {
    min: 500,
    max: 2000,
  },
};

/**
 * Configuration de la mémoire
 */
export const MEMORY_CONFIG = {
  maxMemories: 1000,
  maxFlashMemories: 50,
  importanceThreshold: 0.7,
  flashMemoryThreshold: 0.9,
};

/**
 * Configuration des streaks
 */
export const STREAK_CONFIG = {
  // Heures sans interaction avant de perdre le streak
  maxHoursWithoutInteraction: 48,
  // Bonus XP par jour de streak
  xpBonusPerDay: 5,
  // Streak max pour le bonus
  maxStreakBonus: 30,
};
