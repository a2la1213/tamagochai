// src/constants/avatar.ts
// Constantes pour l'avatar

import {
  AvatarType,
  AvatarStyle,
  AvatarColor,
  AvatarExpression,
  AvatarItemSlot,
  ItemCategory,
  ItemRarity,
  AvatarItem,
  AvatarConfig,
  EquippedItems,
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
    description: 'Un compagnon mécanique et logique',
    emoji: '🤖',
  },
  humanoid: {
    name: 'Humanoïde',
    description: 'Un ami à forme humaine',
    emoji: '🧑',
  },
  creature: {
    name: 'Créature',
    description: 'Un être fantastique et mystérieux',
    emoji: '🐲',
  },
  spirit: {
    name: 'Esprit',
    description: 'Une entité éthérée et spirituelle',
    emoji: '👻',
  },
  animal: {
    name: 'Animal',
    description: 'Un compagnon animal adorable',
    emoji: '🐱',
  },
  abstract: {
    name: 'Abstrait',
    description: 'Une forme géométrique vivante',
    emoji: '◆',
  },
};

/**
 * Configuration des styles d'avatar
 */
export const AVATAR_STYLE_CONFIG: Record<AvatarStyle, {
  name: string;
  description: string;
}> = {
  cute: {
    name: 'Mignon',
    description: 'Style adorable et kawaii',
  },
  cool: {
    name: 'Cool',
    description: 'Style décontracté et branché',
  },
  elegant: {
    name: 'Élégant',
    description: 'Style raffiné et sophistiqué',
  },
  funny: {
    name: 'Drôle',
    description: 'Style amusant et comique',
  },
  neutral: {
    name: 'Neutre',
    description: 'Style simple et équilibré',
  },
  feminine: {
    name: 'Féminin',
    description: 'Style doux et gracieux',
  },
  masculine: {
    name: 'Masculin',
    description: 'Style fort et affirmé',
  },
};

/**
 * Configuration des couleurs d'avatar
 */
export const AVATAR_COLOR_CONFIG: Record<AvatarColor, {
  name: string;
  hex: string;
  emoji: string;
}> = {
  blue: {
    name: 'Bleu',
    hex: '#3B82F6',
    emoji: '🔵',
  },
  purple: {
    name: 'Violet',
    hex: '#8B5CF6',
    emoji: '🟣',
  },
  green: {
    name: 'Vert',
    hex: '#10B981',
    emoji: '🟢',
  },
  yellow: {
    name: 'Jaune',
    hex: '#F59E0B',
    emoji: '🟡',
  },
  red: {
    name: 'Rouge',
    hex: '#EF4444',
    emoji: '🔴',
  },
  orange: {
    name: 'Orange',
    hex: '#F97316',
    emoji: '🟠',
  },
  pink: {
    name: 'Rose',
    hex: '#EC4899',
    emoji: '💗',
  },
  cyan: {
    name: 'Cyan',
    hex: '#06B6D4',
    emoji: '🩵',
  },
  black: {
    name: 'Noir',
    hex: '#1F2937',
    emoji: '⚫',
  },
  white: {
    name: 'Blanc',
    hex: '#F9FAFB',
    emoji: '⚪',
  },
  gold: {
    name: 'Or',
    hex: '#D4AF37',
    emoji: '🌟',
  },
};

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
    description: 'Vêtements, costumes, tenues',
    maxEquipped: 1,
  },
  accessory: {
    name: 'Accessoire',
    description: 'Objets tenus, compagnons, extras',
    maxEquipped: 2,
  },
  background: {
    name: 'Fond',
    description: 'Arrière-plans et décors',
    maxEquipped: 1,
  },
  effect: {
    name: 'Effet',
    description: 'Particules, auras, effets visuels',
    maxEquipped: 1,
  },
};

/**
 * Configuration des raretés
 */
export const ITEM_RARITY_CONFIG: Record<ItemRarity, {
  name: string;
  color: string;
  dropRate: number;
}> = {
  common: {
    name: 'Commun',
    color: '#9CA3AF',
    dropRate: 0.5,
  },
  uncommon: {
    name: 'Peu commun',
    color: '#10B981',
    dropRate: 0.3,
  },
  rare: {
    name: 'Rare',
    color: '#3B82F6',
    dropRate: 0.15,
  },
  epic: {
    name: 'Épique',
    color: '#8B5CF6',
    dropRate: 0.04,
  },
  legendary: {
    name: 'Légendaire',
    color: '#F59E0B',
    dropRate: 0.01,
  },
};

/**
 * Items par défaut disponibles
 */
export const DEFAULT_ITEMS: Partial<AvatarItem>[] = [
  {
    id: 'hat_basic',
    name: 'Chapeau basique',
    description: 'Un chapeau simple',
    slot: 'head',
    category: 'head',
    rarity: 'common',
    isPremium: false,
  },
  {
    id: 'hat_crown',
    name: 'Couronne',
    description: 'Une couronne royale',
    slot: 'head',
    category: 'head',
    rarity: 'rare',
    isPremium: false,
  },
  {
    id: 'glasses_cool',
    name: 'Lunettes de soleil',
    description: 'Des lunettes stylées',
    slot: 'face',
    category: 'face',
    rarity: 'uncommon',
    isPremium: false,
  },
  {
    id: 'glasses_nerd',
    name: 'Lunettes geek',
    description: 'Des lunettes de geek',
    slot: 'face',
    category: 'face',
    rarity: 'common',
    isPremium: false,
  },
  {
    id: 'costume_suit',
    name: 'Costume',
    description: 'Un costume élégant',
    slot: 'body',
    category: 'body',
    rarity: 'uncommon',
    isPremium: false,
  },
  {
    id: 'pet_cat',
    name: 'Chat',
    description: 'Un petit chat mignon',
    slot: 'accessory',
    category: 'accessory',
    rarity: 'rare',
    isPremium: false,
  },
  {
    id: 'pet_bird',
    name: 'Oiseau',
    description: 'Un petit oiseau coloré',
    slot: 'accessory',
    category: 'accessory',
    rarity: 'uncommon',
    isPremium: false,
  },
  {
    id: 'bg_gradient_blue',
    name: 'Dégradé bleu',
    description: 'Un fond dégradé bleu apaisant',
    slot: 'background',
    category: 'background',
    rarity: 'common',
    isPremium: false,
  },
  {
    id: 'bg_gradient_purple',
    name: 'Dégradé violet',
    description: 'Un fond dégradé violet mystique',
    slot: 'background',
    category: 'background',
    rarity: 'uncommon',
    isPremium: false,
  },
  {
    id: 'effect_sparkles',
    name: 'Étincelles',
    description: 'Des étincelles magiques',
    slot: 'effect',
    category: 'effect',
    rarity: 'rare',
    isPremium: false,
  },
];

/**
 * Configuration d'avatar par défaut
 */
export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  type: 'robot',
  style: 'neutral',
  color: 'blue',
  currentExpression: 'neutral',
  equippedItems: {
    head: null,
    face: null,
    body: null,
    accessory: null,
    background: 'bg_gradient_blue',
    effect: null,
  },
};
