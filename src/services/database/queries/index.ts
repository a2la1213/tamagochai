// src/services/database/queries/index.ts
// Barrel export de toutes les queries

export {
  createTamagochai,
  getTamagochaiById,
  getActiveTamagochai,
  tamagochaiExists,
  updateName,
  updateAvatar,
  updateStage,
  addXP,
  incrementMessageCount as incrementTamagochaiMessageCount,
  incrementConversationCount,
  updateLastInteraction,
  updateStreak,
  updateDaysAlive,
  markFirstLaunchComplete,
  deleteTamagochai,
  getStats,
} from './tamagochai';

export {
  createConversation,
  getConversationById,
  getActiveConversation,
  getRecentConversations,
  updateConversation,
  incrementMessageCount as incrementConversationMessageCount,
  addXPEarned,
  incrementMemoriesCreated,
  endConversation,
  deleteConversation,
  createMessage,
  getMessageById,
  getMessages,
  getRecentMessages,
  getLastMessage,
  updateMessage,
  markAsRegenerated,
  deleteMessage,
  countMessages,
  getAllMessages,
} from './conversations';

export * from './memories';
export * from './hormones';
