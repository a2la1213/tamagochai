// src/constants/index.ts
// Export centralisé de toutes les constantes

export {
  HORMONE_CONFIGS,
  HORMONE_THRESHOLDS,
  DEFAULT_HORMONE_LEVELS,
  HORMONE_MODIFIERS,
  calculateDecayFactor,
  applyDecayToBaseline,
} from './hormones';

export {
  EMOTION_CONFIGS,
  EMOTION_TO_EXPRESSION,
  EMOTION_INTENSITY_THRESHOLDS,
  POSITIVE_EMOTIONS,
  NEGATIVE_EMOTIONS,
  NEUTRAL_EMOTIONS,
} from './emotions';

export {
  EVOLUTION_STAGES,
  STAGE_ORDER,
  XP_SOURCES,
  getNextStage,
  getStageForXP,
  calculateStageProgress,
} from './evolution';

export {
  AVATAR_TYPE_CONFIG,
  AVATAR_STYLE_CONFIG,
  AVATAR_COLOR_CONFIG,
  ITEM_CATEGORY_CONFIG,
  ITEM_RARITY_CONFIG,
  DEFAULT_ITEMS,
  DEFAULT_AVATAR_CONFIG,
} from './avatar';

export {
  APP_CONFIG,
} from './app';
