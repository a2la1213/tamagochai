// src/constants/avatar.ts
// Constantes pour l'avatar et la personnalisation

import { 
  AvatarType, 
  AvatarStyle, 
  AvatarColor, 
  AvatarExpression,
  ItemCategory,
  ItemRarity,
  AvatarItem,
} from '../types';

/**
 * Configuration des types d'avatar
 */
export const AVATAR_TYPE_CONFIG: Record<AvatarType, {
  name: string;
  description: string;
  emoji: string;
}> = {
  robot: {
    name: 'Robot',
    description: 'IA assumée, mécanique, technologique',
    emoji: '🤖',
  },
  humanoid: {
    name: 'Humanoïde',
    description: 'Proche de l\'humain, expressif, familier',
    emoji: '👤',
  },
  creature: {
    name: 'Créature',
    description: 'Fantaisie, magique, mythologique',
    emoji: '🧝',
  },
  spirit: {
    name: 'Esprit',
    description: 'Éthéré, immatériel, mystérieux',
    emoji: '👻',
  },
  animal: {
    name: 'Animal',
    description: 'Mignon, familier, attachant',
    emoji: '🐱',
  },
  abstract: {
    name: 'Abstrait',
    description: 'Formes géométriques, non-figuratif',
    emoji: '◆',
  },
};

/**
 * Configuration des styles
 */
export const AVATAR_STYLE_CONFIG: Record<AvatarStyle, {
  name: string;
  description: string;
}> = {
  feminine: {
    name: 'Féminin',
    description: 'Traits doux, courbes élégantes',
  },
  masculine: {
    name: 'Masculin',
    description: 'Traits marqués, angles définis',
  },
  neutral: {
    name: 'Neutre',
    description: 'Équilibré, androgyne',
  },
};

/**
 * Configuration des couleurs
 */
export const AVATAR_COLOR_CONFIG: Record<AvatarColor, {
  name: string;
  hex: string;
  emoji: string;
}> = {
  blue: {
    name: 'Bleu Océan',
    hex: '#3B82F6',
    emoji: '🔵',
  },
  purple: {
    name: 'Violet Cosmos',
    hex: '#8B5CF6',
    emoji: '🟣',
  },
  green: {
    name: 'Vert Nature',
    hex: '#22C55E',
    emoji: '🟢',
  },
  yellow: {
    name: 'Or Soleil',
    hex: '#EAB308',
    emoji: '🟡',
  },
  red: {
    name: 'Rouge Passion',
    hex: '#EF4444',
    emoji: '🔴',
  },
  orange: {
    name: 'Orange Énergie',
    hex: '#F97316',
    emoji: '🟠',
  },
  black: {
    name: 'Noir Mystère',
    hex: '#1F2937',
    emoji: '⚫',
  },
  white: {
    name: 'Blanc Pur',
    hex: '#F9FAFB',
    emoji: '⚪',
  },
  pink: {
    name: 'Rose Doux',
    hex: '#EC4899',
    emoji: '🩷',
  },
  cyan: {
    name: 'Cyan Tech',
    hex: '#06B6D4',
    emoji: '🩵',
  },
};

/**
 * Liste ordonnée des expressions
 */
export const AVATAR_EXPRESSIONS: AvatarExpression[] = [
  'neutral',
  'happy',
  'sad',
  'angry',
  'scared',
  'loving',
];

/**
 * Configuration des catégories d'items
 */
export const ITEM_CATEGORY_CONFIG: Record<ItemCategory, {
  name: string;
  description: string;
  maxEquipped: number;
}> = {
  head: {
    name: 'Tête',
    description: 'Chapeaux, couronnes, accessoires de tête',
    maxEquipped: 1,
  },
  face: {
    name: 'Visage',
    description: 'Lunettes, masques, accessoires faciaux',
    maxEquipped: 1,
  },
  body: {
    name: 'Corps',
    description: 'Vêtements, tenues, accessoires corporels',
    maxEquipped: 1,
  },
  accessory: {
    name: 'Accessoire',
    description: 'Objets tenus, bijoux, décorations',
    maxEquipped: 1,
  },
  background: {
    name: 'Fond',
    description: 'Arrière-plans personnalisés',
    maxEquipped: 1,
  },
  effect: {
    name: 'Effet',
    description: 'Effets visuels, particules, auras',
    maxEquipped: 1,
  },
};

/**
 * Configuration des raretés
 */
export const ITEM_RARITY_CONFIG: Record<ItemRarity, {
  name: string;
  color: string;
  starMultiplier: number;
}> = {
  common: {
    name: 'Commun',
    color: '#9CA3AF',
    starMultiplier: 1,
  },
  uncommon: {
    name: 'Peu commun',
    color: '#22C55E',
    starMultiplier: 2,
  },
  rare: {
    name: 'Rare',
    color: '#3B82F6',
    starMultiplier: 4,
  },
  epic: {
    name: 'Épique',
    color: '#8B5CF6',
    starMultiplier: 8,
  },
  legendary: {
    name: 'Légendaire',
    color: '#EAB308',
    starMultiplier: 16,
  },
};

/**
 * Items gratuits de base (MVP)
 */
export const DEFAULT_ITEMS: Partial<AvatarItem>[] = [
  // Têtes
  {
    id: 'head_none',
    name: 'Aucun',
    description: 'Pas d\'accessoire de tête',
    category: 'head',
    rarity: 'common',
    isPremium: false,
    priceStars: 0,
    compatibleTypes: ['robot', 'humanoid', 'creature', 'spirit', 'animal', 'abstract'],
  },
  {
    id: 'head_cap_basic',
    name: 'Casquette simple',
    description: 'Une casquette décontractée',
    category: 'head',
    rarity: 'common',
    isPremium: false,
    priceStars: 0,
    compatibleTypes: ['robot', 'humanoid', 'creature', 'animal'],
  },
  
  // Visage
  {
    id: 'face_none',
    name: 'Aucun',
    description: 'Pas d\'accessoire facial',
    category: 'face',
    rarity: 'common',
    isPremium: false,
    priceStars: 0,
    compatibleTypes: ['robot', 'humanoid', 'creature', 'spirit', 'animal', 'abstract'],
  },
  {
    id: 'face_glasses_round',
    name: 'Lunettes rondes',
    description: 'Des lunettes rondes classiques',
    category: 'face',
    rarity: 'common',
    isPremium: false,
    priceStars: 0,
    compatibleTypes: ['robot', 'humanoid', 'creature', 'animal'],
  },
  
  // Corps
  {
    id: 'body_none',
    name: 'Aucun',
    description: 'Pas de vêtement',
    category: 'body',
    rarity: 'common',
    isPremium: false,
    priceStars: 0,
    compatibleTypes: ['robot', 'humanoid', 'creature', 'spirit', 'animal', 'abstract'],
  },
  
  // Accessoires
  {
    id: 'accessory_none',
    name: 'Aucun',
    description: 'Pas d\'accessoire',
    category: 'accessory',
    rarity: 'common',
    isPremium: false,
    priceStars: 0,
    compatibleTypes: ['robot', 'humanoid', 'creature', 'spirit', 'animal', 'abstract'],
  },
  {
    id: 'accessory_star_badge',
    name: 'Badge étoile',
    description: 'Un joli badge en forme d\'étoile',
    category: 'accessory',
    rarity: 'common',
    isPremium: false,
    priceStars: 0,
    compatibleTypes: ['robot', 'humanoid', 'creature', 'spirit', 'animal', 'abstract'],
  },
  
  // Fonds
  {
    id: 'bg_gradient_blue',
    name: 'Dégradé bleu',
    description: 'Un fond dégradé bleu apaisant',
    category: 'background',
    rarity: 'common',
    isPremium: false,
    priceStars: 0,
    compatibleTypes: ['robot', 'humanoid', 'creature', 'spirit', 'animal', 'abstract'],
  },
  {
    id: 'bg_gradient_purple',
    name: 'Dégradé violet',
    description: 'Un fond dégradé violet mystique',
    category: 'background',
    rarity: 'common',
    isPremium: false,
    priceStars: 0,
    compatibleTypes: ['robot', 'humanoid', 'creature', 'spirit', 'animal', 'abstract'],
  },
  
  // Effets
  {
    id: 'effect_none',
    name: 'Aucun',
    description: 'Pas d\'effet',
    category: 'effect',
    rarity: 'common',
    isPremium: false,
    priceStars: 0,
    compatibleTypes: ['robot', 'humanoid', 'creature', 'spirit', 'animal', 'abstract'],
  },
];

/**
 * Configuration par défaut de l'avatar
 */
export const DEFAULT_AVATAR_CONFIG = {
  type: 'robot' as AvatarType,
  style: 'neutral' as AvatarStyle,
  color: 'blue' as AvatarColor,
  currentExpression: 'neutral' as AvatarExpression,
  equippedItems: {
    head: null,
    face: null,
    body: null,
    accessory: null,
    background: 'bg_gradient_blue',
    effect: null,
  },
};
