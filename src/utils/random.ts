// src/utils/random.ts
// Fonctions pour la génération aléatoire

import { Genome } from '../types';

/**
 * Génère un nombre aléatoire suivant une distribution gaussienne
 * Utilise la méthode Box-Muller
 */
export function gaussianRandom(mean: number = 0, stdev: number = 1): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdev + mean;
}

/**
 * Génère un nombre gaussien limité entre min et max
 */
export function gaussianRandomClamped(
  mean: number,
  stdev: number,
  min: number,
  max: number
): number {
  let value: number;
  do {
    value = gaussianRandom(mean, stdev);
  } while (value < min || value > max);
  return value;
}

/**
 * Choisit un élément aléatoire dans un tableau
 */
export function randomChoice<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot choose from empty array');
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Choisit N éléments aléatoires dans un tableau (sans répétition)
 */
export function randomSample<T>(array: T[], n: number): T[] {
  if (n > array.length) {
    throw new Error('Sample size cannot exceed array length');
  }
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

/**
 * Génère un entier aléatoire entre min et max (inclus)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Génère un nombre flottant aléatoire entre min et max
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Retourne true avec une probabilité donnée (0-1)
 */
export function randomChance(probability: number): boolean {
  return Math.random() < probability;
}

/**
 * Mélange un tableau (Fisher-Yates)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Sélectionne un élément avec des poids
 */
export function weightedChoice<T>(items: T[], weights: number[]): T {
  if (items.length !== weights.length) {
    throw new Error('Items and weights must have same length');
  }
  
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  
  return items[items.length - 1];
}

/**
 * Génère un génome aléatoire pour un nouveau TamagochAI
 * Utilise une distribution gaussienne centrée sur 50
 */
export function generateGenome(): Genome {
  const generateTrait = () => 
    Math.round(gaussianRandomClamped(50, 20, 5, 95));
  
  return {
    social: generateTrait(),
    cognitive: generateTrait(),
    emotional: generateTrait(),
    energy: generateTrait(),
    creativity: generateTrait(),
  };
}

/**
 * Génère un génome avec des biais spécifiques
 */
export function generateBiasedGenome(biases: Partial<Genome>): Genome {
  const base = generateGenome();
  return {
    social: biases.social ?? base.social,
    cognitive: biases.cognitive ?? base.cognitive,
    emotional: biases.emotional ?? base.emotional,
    energy: biases.energy ?? base.energy,
    creativity: biases.creativity ?? base.creativity,
  };
}

/**
 * Génère une variation aléatoire autour d'une valeur
 */
export function randomVariation(value: number, maxVariation: number): number {
  return value + randomFloat(-maxVariation, maxVariation);
}

/**
 * Génère un ID aléatoire court (pour debug/affichage)
 */
export function randomShortId(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Génère une couleur hexadécimale aléatoire
 */
export function randomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * Sélectionne aléatoirement avec une probabilité décroissante
 * (premier élément plus probable que le dernier)
 */
export function decayingChoice<T>(items: T[], decayFactor: number = 0.5): T {
  const weights = items.map((_, i) => Math.pow(decayFactor, i));
  return weightedChoice(items, weights);
}
