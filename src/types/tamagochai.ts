// src/types/tamagochai.ts
// Types pour le TamagochAI principal

import { Genome } from './genome';
import { AvatarConfig } from './avatar';
import { HormoneLevels } from './hormone';
import { EmotionState } from './emotion';
import { EvolutionStage } from './evolution';

/**
 * Statistiques du TamagochAI
 */
export interface TamagochaiStats {
  totalMessages: number;
  totalConversations: number;
  totalXP: number;
  currentStage: EvolutionStage;
  daysAlive: number;
  currentStreak: number;
  longestStreak: number;
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
  genome?: Partial<Genome>;
  avatar?: Partial<AvatarConfig>;
}

/**
 * Résumé du TamagochAI pour affichage
 */
export interface TamagochaiSummary {
  id: string;
  name: string;
  stage: EvolutionStage;
  emotion: string;
  avatarType: string;
  daysAlive: number;
}
