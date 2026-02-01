// src/types/memory.ts
// Système de mémoire du TamagochAI

/**
 * Types de mémoire
 */
export type MemoryType =
  | 'fact'           // Fait sur l'utilisateur (nom, préférences)
  | 'event'          // Événement vécu ensemble
  | 'emotion'        // Moment émotionnel partagé
  | 'preference'     // Préférence découverte
  | 'relationship'   // Info sur relation (ami, famille mentionnés)
  | 'topic'          // Sujet de discussion
  | 'flash';         // Souvenir flash (très émotionnel, permanent)

/**
 * Importance d'un souvenir
 */
export type MemoryImportance = 'low' | 'medium' | 'high' | 'critical';

/**
 * Souvenir individuel
 */
export interface Memory {
  id: string;
  type: MemoryType;
  content: string;              // Le souvenir en texte
  summary: string;              // Résumé court pour contexte
  importance: MemoryImportance;
  importanceScore: number;      // 0-100 pour tri
  
  // Contexte
  conversationId?: string;
  messageId?: string;
  topics: string[];
  
  // Émotion associée
  emotionAtCreation: string;
  emotionalValence: number;     // -1 à +1
  
  // Dates
  createdAt: Date;
  lastAccessedAt: Date;
  accessCount: number;
  
  // Pour consolidation
  isConsolidated: boolean;
  consolidatedInto?: string;    // ID du souvenir consolidé
  
  // Flash memory
  isFlashMemory: boolean;
  flashTrigger?: string;        // Ce qui a déclenché le flash
}

/**
 * Requête de recherche de souvenirs
 */
export interface MemoryQuery {
  searchText?: string;          // Recherche full-text
  types?: MemoryType[];
  minImportance?: MemoryImportance;
  topics?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  limit?: number;
  includeConsolidated?: boolean;
}

/**
 * Résultat de recherche avec score de pertinence
 */
export interface MemorySearchResult {
  memory: Memory;
  relevanceScore: number;       // 0-1
  matchedTerms: string[];
}

/**
 * Contexte mémoire pour prompt LLM
 */
export interface MemoryContext {
  shortTerm: Message[];         // Messages récents (from conversation.ts)
  relevantMemories: Memory[];   // Souvenirs pertinents au contexte
  flashMemories: Memory[];      // Souvenirs flash toujours inclus
  userFacts: Memory[];          // Faits sur l'utilisateur
}

/**
 * Extraction de mémoire depuis une conversation
 */
export interface MemoryExtraction {
  suggestedMemories: {
    content: string;
    type: MemoryType;
    importance: MemoryImportance;
    topics: string[];
  }[];
  confidence: number;           // Confiance dans l'extraction
}

/**
 * Consolidation de souvenirs
 */
export interface MemoryConsolidation {
  sourceMemoryIds: string[];
  consolidatedMemory: Memory;
  consolidationReason: string;
  timestamp: Date;
}

/**
 * Statistiques mémoire
 */
export interface MemoryStats {
  totalMemories: number;
  byType: Record<MemoryType, number>;
  byImportance: Record<MemoryImportance, number>;
  flashMemoriesCount: number;
  consolidatedCount: number;
  averageAccessCount: number;
  oldestMemory: Date;
  newestMemory: Date;
}

/**
 * Configuration de la mémoire
 */
export interface MemoryConfig {
  shortTermLimit: number;       // Nombre de messages en mémoire courte
  maxMemoriesInContext: number; // Max souvenirs dans le prompt
  consolidationThreshold: number; // Jours avant consolidation
  importanceDecayRate: number;  // Décroissance importance/jour
  flashMemoryThreshold: number; // Seuil émotionnel pour flash
}

// Import du type Message pour MemoryContext
import { Message } from './conversation';
