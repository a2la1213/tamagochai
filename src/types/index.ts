// src/types/index.ts
// Export centralisé de tous les types

export {
  Genome,
  GenomeTrait,
  GenomeTraitConfig,
} from './genome';

export {
  HormoneType,
  HormoneLevels,
  HormoneState,
  HormoneConfig,
  HormoneModifier,
  HormoneHistory,
  HormoneThresholds,
  HormoneSummary,
} from './hormone';

export {
  EmotionType,
  EmotionIntensity,
  EmotionState,
  EmotionConfig,
  EmotionTransition,
} from './emotion';

export {
  AvatarType,
  AvatarStyle,
  AvatarColor,
  AvatarExpression,
  AvatarItemSlot,
  AvatarItem,
  EquippedItems,
  AvatarConfig,
  ItemCategory,
  ItemRarity,
} from './avatar';

export {
  EvolutionStage,
  StageConfig,
  XPSource,
  XPSourceConfig,
  XPEvent,
  EvolutionProgress,
  DevelopmentMode,
  XP_MULTIPLIERS,
} from './evolution';

export {
  MemoryType,
  MemoryImportance,
  Memory,
  MemoryQuery,
  MemorySearchResult,
  MemoryStats,
} from './memory';

export {
  MessageRole,
  MessageContentType,
  Message,
  Conversation,
  ConversationSummary,
  SendMessageRequest,
  LoadMessagesOptions,
} from './conversation';

export {
  SensorType,
  BatteryState,
  NetworkState,
  TimeContext,
  SensorContext,
  SensorReaction,
} from './sensors';

export {
  TamagochaiState,
  TamagochaiStats,
  CreateTamagochaiConfig,
  TamagochaiSummary,
} from './tamagochai';
