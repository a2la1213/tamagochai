// src/types/index.ts
// Barrel export de tous les types

// Tamagochai principal
export type {
  Genome,
  TamagochaiStats,
  TamagochaiState,
  CreateTamagochaiConfig,
  TamagochaiSummary,
  DevelopmentMode,
} from './tamagochai';
export { XP_MULTIPLIERS } from './tamagochai';

// Hormones
export type {
  HormoneType,
  HormoneLevels,
  HormoneConfig,
  HormoneModifier,
  HormoneEvent,
  HormoneState,
  HormoneThresholds,
  HormoneLevel,
  HormoneSummary,
} from './hormone';

// Émotions
export type {
  EmotionType,
  EmotionIntensity,
  EmotionState,
  EmotionConfig,
  EmotionTransition,
  EmotionCalculation,
  EmotionHistory,
  EmotionSummary,
} from './emotion';
export type { AvatarExpression as EmotionExpression } from './emotion';

// Évolution
export type {
  EvolutionStage,
  StageConfig,
  XPSource,
  XPSourceConfig,
  XPEvent,
  EvolutionProgress,
  EvolutionEvent,
  XPStats,
  XPCooldowns,
} from './evolution';

// Conversations
export type {
  MessageRole,
  MessageContentType,
  Message,
  Conversation,
  ConversationSummary,
  ConversationContext,
  SendMessageRequest,
  SendMessageResponse,
  ConversationEvent,
  LoadMessagesOptions,
  ConversationStats,
} from './conversation';

// Mémoire
export type {
  MemoryType,
  MemoryImportance,
  Memory,
  MemoryQuery,
  MemorySearchResult,
  MemoryContext,
  MemoryExtraction,
  MemoryConsolidation,
  MemoryStats,
  MemoryConfig,
} from './memory';

// Avatar
export type {
  AvatarType,
  AvatarStyle,
  AvatarExpression,
  AvatarColor,
  AvatarConfig,
  EquippedItems,
  ItemCategory,
  ItemRarity,
  AvatarItem,
  OwnedItem,
} from './avatar';
export { AVATAR_COLORS, AVATAR_TYPE_NAMES, AVATAR_STYLE_NAMES } from './avatar';

// Capteurs
export type {
  SensorType,
  BatteryState,
  NetworkState,
  TimeContext,
  SensorContext,
  SensorEvent,
  SensorThresholds,
  SensorReactionConfig,
  SensorReaction,
  SensorStats,
} from './sensor';

// LLM
export type {
  LLMModel,
  LLMStatus,
  LLMConfig,
  LLMRequest,
  LLMResponse,
  LLMStreamCallback,
  LLMDownloadProgress,
  LLMModelInfo,
  LLMState,
} from './llm';
export { DEFAULT_LLM_CONFIG, LLM_MODELS } from './llm';
