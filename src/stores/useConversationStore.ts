// src/stores/useConversationStore.ts
// Store pour la gestion des conversations et messages

import { create } from 'zustand';
import {
  Conversation,
  ConversationSummary,
  Message,
  MessageRole,
  SendMessageRequest,
} from '../types';
import {
  createConversation,
  getActiveConversation,
  getConversationById,
  getRecentConversations,
  endConversation,
  createMessage,
  getRecentMessages,
  getMessages,
  deleteConversation,
  updateConversation,
  incrementTamagochaiMessageCount,
} from '../services/database';
import { hormoneService, evolutionService } from '../services/core';
import { HORMONE_MODIFIERS } from '../constants';

interface ConversationStore {
  // État
  currentConversation: Conversation | null;
  messages: Message[];
  recentConversations: ConversationSummary[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;

  // Actions conversation
  startConversation: (tamagochaiId: string) => Promise<string>;
  loadConversation: (conversationId: string) => Promise<void>;
  loadOrCreateConversation: (tamagochaiId: string) => Promise<void>;
  endCurrentConversation: (reason?: 'user_left' | 'timeout' | 'natural_end') => Promise<void>;
  loadRecentConversations: (tamagochaiId: string) => Promise<void>;
  deleteConversationById: (conversationId: string) => Promise<void>;

  // Actions messages
  sendMessage: (tamagochaiId: string, content: string) => Promise<Message>;
  addAssistantMessage: (content: string, options?: {
    tokensUsed?: number;
    generationTime?: number;
    emotionAtTime?: string;
    hormoneSnapshot?: Record<string, number>;
  }) => Promise<Message>;
  loadMoreMessages: (beforeId: string) => Promise<void>;

  // Helpers
  clearMessages: () => void;
  reset: () => void;
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  // État initial
  currentConversation: null,
  messages: [],
  recentConversations: [],
  isLoading: false,
  isSending: false,
  error: null,

  // Démarre une nouvelle conversation
  startConversation: async (tamagochaiId: string) => {
    set({ isLoading: true, error: null });

    try {
      const conversationId = await createConversation(tamagochaiId);
      const conversation = await getConversationById(conversationId);

      set({
        currentConversation: conversation,
        messages: [],
        isLoading: false,
      });

      return conversationId;
    } catch (error) {
      console.error('[ConversationStore] startConversation error:', error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Charge une conversation existante
  loadConversation: async (conversationId: string) => {
    set({ isLoading: true, error: null });

    try {
      const conversation = await getConversationById(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const messages = await getRecentMessages(conversationId, 50);

      set({
        currentConversation: conversation,
        messages,
        isLoading: false,
      });
    } catch (error) {
      console.error('[ConversationStore] loadConversation error:', error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Charge ou crée une conversation
  loadOrCreateConversation: async (tamagochaiId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Chercher une conversation active
      let conversation = await getActiveConversation(tamagochaiId);

      if (!conversation) {
        // Créer une nouvelle conversation
        const conversationId = await createConversation(tamagochaiId);
        conversation = await getConversationById(conversationId);
      }

      const messages = conversation
        ? await getRecentMessages(conversation.id, 50)
        : [];

      set({
        currentConversation: conversation,
        messages,
        isLoading: false,
      });
    } catch (error) {
      console.error('[ConversationStore] loadOrCreateConversation error:', error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Termine la conversation actuelle
  endCurrentConversation: async (reason = 'natural_end') => {
    const { currentConversation } = get();
    if (!currentConversation) return;

    try {
      await endConversation(currentConversation.id, reason);
      set({ currentConversation: null, messages: [] });
    } catch (error) {
      console.error('[ConversationStore] endCurrentConversation error:', error);
    }
  },

  // Charge les conversations récentes
  loadRecentConversations: async (tamagochaiId: string) => {
    try {
      const conversations = await getRecentConversations(tamagochaiId, 20);
      set({ recentConversations: conversations });
    } catch (error) {
      console.error('[ConversationStore] loadRecentConversations error:', error);
    }
  },

  // Supprime une conversation
  deleteConversationById: async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);

      const { currentConversation, recentConversations } = get();

      // Si c'est la conversation actuelle, la retirer
      if (currentConversation?.id === conversationId) {
        set({ currentConversation: null, messages: [] });
      }

      // Mettre à jour la liste
      set({
        recentConversations: recentConversations.filter(c => c.id !== conversationId),
      });
    } catch (error) {
      console.error('[ConversationStore] deleteConversationById error:', error);
      throw error;
    }
  },

  // Envoie un message utilisateur
  sendMessage: async (tamagochaiId: string, content: string) => {
    const { currentConversation, messages } = get();

    if (!currentConversation) {
      throw new Error('No active conversation');
    }

    set({ isSending: true, error: null });

    try {
      // Créer le message en base
      const messageId = await createMessage(
        currentConversation.id,
        'user',
        content
      );

      // Incrémenter le compteur de messages du TamagochAI
      await incrementTamagochaiMessageCount(tamagochaiId);

      // Récupérer le message complet
      const message: Message = {
        id: messageId,
        conversationId: currentConversation.id,
        role: 'user',
        content,
        contentType: 'text',
        timestamp: new Date(),
      };

      // Ajouter au state local
      set({ messages: [...messages, message], isSending: false });

      // Appliquer les effets hormonaux (message reçu)
      await hormoneService.applyPredefinedModifier(tamagochaiId, 'userMessageReceived');

      // Accorder de l'XP
      await evolutionService.grantXP(tamagochaiId, 'message_sent');

      // Bonus pour message substantiel
      if (content.length > 50) {
        await evolutionService.grantXP(tamagochaiId, 'message_quality');
      }

      return message;
    } catch (error) {
      console.error('[ConversationStore] sendMessage error:', error);
      set({ error: (error as Error).message, isSending: false });
      throw error;
    }
  },

  // Ajoute un message assistant (réponse du LLM)
  addAssistantMessage: async (content: string, options = {}) => {
    const { currentConversation, messages } = get();

    if (!currentConversation) {
      throw new Error('No active conversation');
    }

    try {
      const messageId = await createMessage(
        currentConversation.id,
        'assistant',
        content,
        {
          tokensUsed: options.tokensUsed,
          generationTime: options.generationTime,
          emotionAtTime: options.emotionAtTime,
          hormoneSnapshot: options.hormoneSnapshot,
        }
      );

      const message: Message = {
        id: messageId,
        conversationId: currentConversation.id,
        role: 'assistant',
        content,
        contentType: 'text',
        timestamp: new Date(),
        tokensUsed: options.tokensUsed,
        generationTime: options.generationTime,
        emotionAtTime: options.emotionAtTime,
        hormoneSnapshot: options.hormoneSnapshot,
      };

      set({ messages: [...messages, message] });

      return message;
    } catch (error) {
      console.error('[ConversationStore] addAssistantMessage error:', error);
      throw error;
    }
  },

  // Charge plus de messages (pagination)
  loadMoreMessages: async (beforeId: string) => {
    const { currentConversation, messages } = get();
    if (!currentConversation) return;

    try {
      const olderMessages = await getMessages({
        conversationId: currentConversation.id,
        beforeId,
        limit: 20,
      });

      set({ messages: [...olderMessages, ...messages] });
    } catch (error) {
      console.error('[ConversationStore] loadMoreMessages error:', error);
    }
  },

  // Vide les messages locaux
  clearMessages: () => {
    set({ messages: [] });
  },

  // Réinitialise le store
  reset: () => {
    set({
      currentConversation: null,
      messages: [],
      recentConversations: [],
      isLoading: false,
      isSending: false,
      error: null,
    });
  },
}));

export default useConversationStore;
