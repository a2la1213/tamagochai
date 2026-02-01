// src/types/genome.ts
// Types pour le génome du TamagochAI

/**
 * Traits du génome
 */
export type GenomeTrait = 'social' | 'cognitive' | 'emotional' | 'energy' | 'creativity';

/**
 * Configuration d'un trait
 */
export interface GenomeTraitConfig {
  name: string;
  description: string;
  lowDescription: string;
  highDescription: string;
}

/**
 * Génome complet
 */
export interface Genome {
  social: number;      // 0-100
  cognitive: number;   // 0-100
  emotional: number;   // 0-100
  energy: number;      // 0-100
  creativity: number;  // 0-100
}
