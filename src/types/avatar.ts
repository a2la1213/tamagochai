// src/types/avatar.ts
// Types pour l'avatar du TamagochAI

/**
 * Types d'avatar
 */
export type AvatarType = 'robot' | 'humanoid' | 'creature' | 'spirit' | 'animal' | 'abstract';

/**
 * Styles d'avatar
 */
export type AvatarStyle = 'cute' | 'cool' | 'elegant' | 'funny' | 'neutral' | 'feminine' | 'masculine';

/**
 * Couleurs d'avatar
 */
export type AvatarColor = 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'orange' | 'pink' | 'cyan' | 'black' | 'white' | 'gold';

/**
 * Expressions faciales
 */
export type AvatarExpression = 'neutral' | 'happy' | 'sad' | 'angry' | 'scared' | 'loving';

/**
 * Emplacements d'items
 */
export type AvatarItemSlot = 'head' | 'face' | 'body' | 'accessory' | 'background' | 'effect';

/**
 * Catégories d'items
 */
export type ItemCategory = 'head' | 'face' | 'body' | 'accessory' | 'background' | 'effect';

/**
 * Rareté des items
 */
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * Item d'avatar
 */
export interface AvatarItem {
  id: string;
  name: string;
  description?: string;
  slot: AvatarItemSlot;
  category: ItemCategory;
  rarity: ItemRarity;
  unlockedAt?: string;
  isPremium?: boolean;
}

/**
 * Items équipés
 */
export interface EquippedItems {
  head: string | null;
  face: string | null;
  body: string | null;
  accessory: string | null;
  background: string | null;
  effect: string | null;
}

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
