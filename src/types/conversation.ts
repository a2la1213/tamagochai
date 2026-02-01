// src/types/conversation.ts
// Types pour les conversations et messages

/**
 * Rôle dans la conversation
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Type de contenu du message
 */
export type MessageContentType = 'text' | 'image' | 'audio' | 'system_event';

/**
 * Message individuel
 */
export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  contentType: MessageContentType;
  timestamp: Date;
  
  // Métadonnées
  tokensUsed?: number;
  generationTime?: number;      // Temps de génération en ms
  
  // État émotionnel au moment du message
  emotionAtTime?: string;
  hormoneSnapshot?: Record<string, number>;
  
  // Pour messages user
  isEdited?: boolean;
  editedAt?: Date;
  
  // Pour messages assistant
  isRegenerated?: boolean;
  regenerationCount?: number;
}

/**
 * Conversation complète
 */
export interface Conversation {
  id: string;
  title: string | null;         // Titre auto-généré ou null
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  
  // Contexte
  summary?: string;             // Résumé de la conversation
  topics: string[];             // Sujets abordés
  mood: string;                 // Ambiance générale
  
  // Métriques
  xpEarned: number;
  memoriesCreated: number;
  
  // État
  isActive: boolean;
  endedAt?: Date;
  endReason?: 'user_left' | 'timeout' | 'natural_end';
}

/**
 * Résumé de conversation pour liste
 */
export interface ConversationSummary {
  id: string;
  title: string | null;
  preview: string;              // Dernier message tronqué
  messageCount: number;
  updatedAt: Date;
  mood: string;
}

/**
 * Contexte pour génération de réponse
 */
export interface ConversationContext {
  recentMessages: Message[];    // 10-20 derniers messages
  conversationSummary?: string;
  relevantMemories: string[];   // Souvenirs pertinents
  currentEmotion: string;
  currentHormones: Record<string, number>;
  sensorContext: Record<string, any>;
  userPreferences: Record<string, any>;
}

/**
 * Requête d'envoi de message
 */
export interface SendMessageRequest {
  content: string;
  contentType?: MessageContentType;
  conversationId?: string;      // Si null, nouvelle conversation
  metadata?: Record<string, any>;
}

/**
 * Réponse à un envoi de message
 */
export interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
  conversationId: string;
  xpEarned: number;
  emotionChange?: {
    from: string;
    to: string;
  };
  memoriesCreated: string[];    // IDs des souvenirs créés
}

/**
 * Événement de conversation (pour analytics)
 */
export interface ConversationEvent {
  type: 'started' | 'message_sent' | 'message_received' | 'ended';
  conversationId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Options de chargement des messages
 */
export interface LoadMessagesOptions {
  conversationId: string;
  limit?: number;
  beforeId?: string;            // Pagination
  afterId?: string;
}

/**
 * Statistiques de conversation
 */
export interface ConversationStats {
  totalConversations: number;
  totalMessages: number;
  averageMessagesPerConversation: number;
  averageConversationDuration: number; // en minutes
  longestConversation: number;  // nombre de messages
  topTopics: { topic: string; count: number }[];
}
