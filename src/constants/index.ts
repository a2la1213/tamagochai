// src/constants/index.ts
// Barrel export de toutes les constantes

// Configuration générale
export { APP_CONFIG, FEATURES, STORAGE_KEYS } from './config';

// Évolution
export {
  EVOLUTION_STAGES,
  XP_SOURCES,
  STAGE_ORDER,
  getNextStage,
  getStageForXP,
} from './evolution';

// Hormones
export {
  HORMONE_CONFIGS,
  DEFAULT_HORMONE_LEVELS,
  HORMONE_THRESHOLDS,
  HORMONE_MODIFIERS,
  calculateDecayFactor,
  applyDecayToBaseline,
} from './hormones';

// Émotions
export {
  EMOTION_CONFIGS,
  EMOTION_TO_EXPRESSION,
  EMOTION_INTENSITY_THRESHOLDS,
  EMOTION_FORMULAS,
  EMOTION_MIN_DURATION,
  EMOTION_TRANSITION_DURATION,
  POSITIVE_EMOTIONS,
  NEGATIVE_EMOTIONS,
  NEUTRAL_EMOTIONS,
} from './emotions';

// Prompts
export {
  SYSTEM_PROMPTS,
  PROMPT_VARIABLES,
  TRAIT_DESCRIPTIONS,
  getTraitDescription,
} from './prompts';

// Avatar
export {
  AVATAR_TYPE_CONFIG,
  AVATAR_STYLE_CONFIG,
  AVATAR_COLOR_CONFIG,
  AVATAR_EXPRESSIONS,
  ITEM_CATEGORY_CONFIG,
  ITEM_RARITY_CONFIG,
  DEFAULT_ITEMS,
  DEFAULT_AVATAR_CONFIG,
} from './avatar';
