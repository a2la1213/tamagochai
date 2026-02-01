// src/constants/config.ts
// Configuration générale de l'application

import { DevelopmentMode } from '../types';

/**
 * Configuration principale de l'app
 */
export const APP_CONFIG = {
  name: 'TamagochAI',
  version: '0.1.0',
  buildNumber: 1,
  
  // Mode de développement (affecte la vitesse d'évolution)
  developmentMode: 'prototype' as DevelopmentMode,
  
  // Database
  database: {
    name: 'tamagochai.db',
    version: 1,
  },
  
  // Limites
  limits: {
    maxMessageLength: 2000,
    maxNameLength: 20,
    minNameLength: 2,
    maxConversationsStored: 100,
    maxMessagesPerConversation: 500,
  },
  
  // Timing
  timing: {
    typingIndicatorDelay: 500,      // ms avant d'afficher "réfléchit..."
    minResponseDelay: 1000,         // ms minimum avant réponse (naturel)
    maxResponseTimeout: 30000,      // ms timeout génération
    hormoneTickInterval: 60000,     // ms entre updates hormones (1 min)
    autoSaveInterval: 30000,        // ms entre sauvegardes auto
  },
  
  // Debug
  debug: {
    enabled: __DEV__,
    showHormones: true,
    showXP: true,
    showMemoryCount: true,
    logLLMPrompts: false,
    logLLMResponses: false,
  },
} as const;

/**
 * Configuration des fonctionnalités
 */
export const FEATURES = {
  // MVP Features
  chat: true,
  evolution: true,
  hormones: true,
  memory: true,
  avatar: true,
  sensors: {
    battery: true,
    time: true,
    network: true,
    light: false,      // V2
    motion: false,     // V2
    location: false,   // V2
  },
  
  // Post-MVP Features
  proactiveMessages: false,
  dreams: false,
  diseases: false,
  death: false,
  cloudBackup: false,
  shop: false,
  achievements: false,
} as const;

/**
 * Clés de stockage AsyncStorage
 */
export const STORAGE_KEYS = {
  settings: '@tamagochai/settings',
  onboardingComplete: '@tamagochai/onboarding_complete',
  lastTamagochaiId: '@tamagochai/last_id',
  developmentMode: '@tamagochai/dev_mode',
  theme: '@tamagochai/theme',
  language: '@tamagochai/language',
} as const;

/**
 * Déclaration de __DEV__ pour TypeScript
 */
declare const __DEV__: boolean;
