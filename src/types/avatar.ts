// src/types/avatar.ts
// Types pour l'avatar et la personnalisation

/**
 * Types d'entités avatar
 */
export type AvatarType =
  | 'robot'      // IA assumée, mécanique, technologique
  | 'humanoid'   // Proche de l'humain, expressif
  | 'creature'   // Fantaisie, magique, mythologique
  | 'spirit'     // Éthéré, immatériel, mystérieux
  | 'animal'     // Mignon, familier, attachant
  | 'abstract';  // Formes géométriques, non-figuratif

/**
 * Styles d'apparence
 */
export type AvatarStyle = 'feminine' | 'masculine' | 'neutral';

/**
 * Expressions faciales (mappées aux émotions)
 */
export type AvatarExpression = 
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'scared'
  | 'loving';

/**
 * Couleurs disponibles
 */
export type AvatarColor =
  | 'blue'       // #3B82F6 - Bleu Océan
  | 'purple'     // #8B5CF6 - Violet Cosmos
  | 'green'      // #22C55E - Vert Nature
  | 'yellow'     // #EAB308 - Or Soleil
  | 'red'        // #EF4444 - Rouge Passion
  | 'orange'     // #F97316 - Orange Énergie
  | 'black'      // #1F2937 - Noir Mystère
  | 'white'      // #F9FAFB - Blanc Pur
  | 'pink'       // #EC4899 - Rose Doux
  | 'cyan';      // #06B6D4 - Cyan Tech

/**
 * Configuration complète de l'avatar
 */
export interface AvatarConfig {
  type: AvatarType;
  style: AvatarStyle;
  color: AvatarColor;
  currentExpression: AvatarExpression;
  equippedItems: EquippedItems;
}

/**
 * Items équipés sur l'avatar
 */
export interface EquippedItems {
  head: string | null;        // Chapeau, couronne, etc.
  face: string | null;        // Lunettes, masque, etc.
  body: string | null;        // Vêtement, accessoire corps
  accessory: string | null;   // Accessoire tenu
  background: string | null;  // Fond personnalisé
  effect: string | null;      // Effet visuel (particules, aura)
}

/**
 * Catégories d'items
 */
export type ItemCategory = 'head' | 'face' | 'body' | 'accessory' | 'background' | 'effect';

/**
 * Rareté d'un item
 */
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * Item de personnalisation
 */
export interface AvatarItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  
  // Disponibilité
  isPremium: boolean;
  priceStars: number | null;   // Prix en étoiles (monnaie gratuite)
  priceGems: number | null;    // Prix en gemmes (monnaie payante)
  
  // Conditions de débloquage
  requiredStage?: EvolutionStage;
  requiredAchievement?: string;
  isLimitedTime?: boolean;
  availableUntil?: Date;
  
  // Compatibilité
  compatibleTypes: AvatarType[];  // Types d'avatar compatibles
  
  // Asset
  assetPath: string;
  thumbnailPath: string;
}

/**
 * Item possédé par l'utilisateur
 */
export interface OwnedItem {
  itemId: string;
  acquiredAt: Date;
  acquiredBy: 'purchase' | 'achievement' | 'gift' | 'evolution' | 'event';
  isEquipped: boolean;
}

/**
 * Configuration des couleurs hex
 */
export const AVATAR_COLORS: Record<AvatarColor, string> = {
  blue: '#3B82F6',
  purple: '#8B5CF6',
  green: '#22C55E',
  yellow: '#EAB308',
  red: '#EF4444',
  orange: '#F97316',
  black: '#1F2937',
  white: '#F9FAFB',
  pink: '#EC4899',
  cyan: '#06B6D4',
};

/**
 * Noms affichables des types
 */
export const AVATAR_TYPE_NAMES: Record<AvatarType, string> = {
  robot: 'Robot',
  humanoid: 'Humanoïde',
  creature: 'Créature',
  spirit: 'Esprit',
  animal: 'Animal',
  abstract: 'Abstrait',
};

/**
 * Noms affichables des styles
 */
export const AVATAR_STYLE_NAMES: Record<AvatarStyle, string> = {
  feminine: 'Féminin',
  masculine: 'Masculin',
  neutral: 'Neutre',
};

// Import pour la compatibilité
import { EvolutionStage } from './evolution';
