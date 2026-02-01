// src/types/tamagochai.ts
// Types principaux du TamagochAI

import { HormoneLevels } from './hormone';
import { EmotionState } from './emotion';
import { EvolutionStage } from './evolution';
import { AvatarConfig } from './avatar';

/**
 * Génome : traits innés générés à la naissance (immuables)
 * Chaque trait est une valeur entre 0 et 100
 */
export interface Genome {
  social: number;      // 0=introverti, 100=extraverti
  cognitive: number;   // 0=intuitif, 100=analytique
  emotional: number;   // 0=stoïque, 100=expressif
  energy: number;      // 0=calme, 100=énergique
  creativity: number;  // 0=pragmatique, 100=imaginatif
}

/**
 * Statistiques du TamagochAI
 */
export interface TamagochaiStats {
  totalMessages: number;
  totalConversations: number;
  totalXP: number;
  currentStage: EvolutionStage;
  daysAlive: number;
  longestStreak: number;      // Jours consécutifs d'interaction
  currentStreak: number;
  memoriesCount: number;
  flashMemoriesCount: number;
}

/**
 * État complet du TamagochAI
 */
export interface TamagochaiState {
  id: string;
  name: string;
  genome: Genome;
  avatar: AvatarConfig;
  stats: TamagochaiStats;
  hormones: HormoneLevels;
  emotion: EmotionState;
  stage: EvolutionStage;
  xp: number;
  createdAt: Date;
  lastInteractionAt: Date;
  isFirstLaunch: boolean;
}

/**
 * Configuration pour créer un nouveau TamagochAI
 */
export interface CreateTamagochaiConfig {
  name: string;
  avatar: AvatarConfig;
  genome?: Partial<Genome>; // Si non fourni, généré aléatoirement
}

/**
 * Résumé léger pour affichage rapide
 */
export interface TamagochaiSummary {
  id: string;
  name: string;
  stage: EvolutionStage;
  dominantEmotion: string;
  lastInteractionAt: Date;
}

/**
 * Mode de développement (affecte la vitesse d'évolution)
 */
export type DevelopmentMode = 'production' | 'prototype' | 'debug';

/**
 * Multiplicateurs XP par mode
 */
export const XP_MULTIPLIERS: Record<DevelopmentMode, number> = {
  production: 1,
  prototype: 10,
  debug: 50,
};
