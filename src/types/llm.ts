// src/types/llm.ts
// Types pour le LLM local (llama.cpp / llama.rn)

/**
 * Modèles LLM supportés
 */
export type LLMModel =
  | 'phi-3-mini'      // Phi-3 Mini 4K - Recommandé MVP (2.3 GB)
  | 'gemma-2b'        // Gemma 2B - Backup léger (1.5 GB)
  | 'llama-3.2-3b'    // Llama 3.2 3B - Alternative (2.0 GB)
  | 'qwen-2.5-3b'     // Qwen 2.5 3B - Bon multilingue (2.0 GB)
  | 'mistral-7b';     // Mistral 7B Q4 - Version complète (4.0 GB)

/**
 * État du LLM
 */
export type LLMStatus =
  | 'not_initialized'  // Pas encore initialisé
  | 'downloading'      // Téléchargement en cours
  | 'loading'          // Chargement en mémoire
  | 'ready'            // Prêt à générer
  | 'generating'       // Génération en cours
  | 'error'            // Erreur
  | 'unloaded';        // Déchargé de la mémoire

/**
 * Configuration du LLM
 */
export interface LLMConfig {
  model: LLMModel;
  modelPath: string;           // Chemin vers le fichier .gguf
  contextSize: number;         // Taille du contexte (4096 par défaut)
  threads: number;             // Nombre de threads CPU
  gpuLayers: number;           // Couches sur GPU (0 = CPU only)
  temperature: number;         // 0.0-2.0, créativité
  topP: number;                // 0.0-1.0, nucleus sampling
  topK: number;                // Top-K sampling
  repeatPenalty: number;       // Pénalité de répétition
  maxTokens: number;           // Max tokens par réponse
}

/**
 * Configuration par défaut
 */
export const DEFAULT_LLM_CONFIG: LLMConfig = {
  model: 'phi-3-mini',
  modelPath: '',
  contextSize: 4096,
  threads: 4,
  gpuLayers: 0,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  repeatPenalty: 1.1,
  maxTokens: 512,
};

/**
 * Requête de génération
 */
export interface LLMRequest {
  prompt: string;              // Prompt complet (system + context + user)
  config?: Partial<LLMConfig>; // Override de config
  stopSequences?: string[];    // Séquences d'arrêt
  stream?: boolean;            // Streaming activé
}

/**
 * Réponse de génération
 */
export interface LLMResponse {
  text: string;                // Texte généré
  tokensGenerated: number;
  tokensPrompt: number;
  generationTime: number;      // Temps en ms
  tokensPerSecond: number;
  stopReason: 'max_tokens' | 'stop_sequence' | 'end_of_text';
  
  // Debug
  promptTruncated: boolean;
  error?: string;
}

/**
 * Callback pour streaming
 */
export type LLMStreamCallback = (chunk: string, isComplete: boolean) => void;

/**
 * Progression du téléchargement
 */
export interface LLMDownloadProgress {
  model: LLMModel;
  bytesDownloaded: number;
  bytesTotal: number;
  percent: number;
  speedBps: number;            // Bytes par seconde
  estimatedTimeRemaining: number; // Secondes
}

/**
 * Info sur un modèle
 */
export interface LLMModelInfo {
  model: LLMModel;
  displayName: string;
  description: string;
  sizeGB: number;
  ramRequired: number;         // RAM minimum en GB
  quality: 1 | 2 | 3 | 4 | 5;  // Étoiles de qualité
  speed: 1 | 2 | 3 | 4 | 5;    // Étoiles de vitesse
  isDownloaded: boolean;
  downloadUrl: string;
  filename: string;
}

/**
 * Catalogue des modèles disponibles
 */
export const LLM_MODELS: Record<LLMModel, Omit<LLMModelInfo, 'isDownloaded'>> = {
  'phi-3-mini': {
    model: 'phi-3-mini',
    displayName: 'Phi-3 Mini',
    description: 'Modèle Microsoft optimisé, excellent rapport qualité/taille',
    sizeGB: 2.3,
    ramRequired: 4,
    quality: 4,
    speed: 4,
    downloadUrl: 'https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf',
    filename: 'phi-3-mini-4k-q4.gguf',
  },
  'gemma-2b': {
    model: 'gemma-2b',
    displayName: 'Gemma 2B',
    description: 'Modèle Google léger, idéal pour appareils limités',
    sizeGB: 1.5,
    ramRequired: 3,
    quality: 3,
    speed: 5,
    downloadUrl: 'https://huggingface.co/google/gemma-2b-it-GGUF/resolve/main/gemma-2b-it-q4_k_m.gguf',
    filename: 'gemma-2b-it-q4.gguf',
  },
  'llama-3.2-3b': {
    model: 'llama-3.2-3b',
    displayName: 'Llama 3.2 3B',
    description: 'Modèle Meta récent, bonne qualité générale',
    sizeGB: 2.0,
    ramRequired: 4,
    quality: 4,
    speed: 4,
    downloadUrl: 'https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct-GGUF/resolve/main/llama-3.2-3b-instruct-q4_k_m.gguf',
    filename: 'llama-3.2-3b-q4.gguf',
  },
  'qwen-2.5-3b': {
    model: 'qwen-2.5-3b',
    displayName: 'Qwen 2.5 3B',
    description: 'Modèle Alibaba, excellent en multilingue',
    sizeGB: 2.0,
    ramRequired: 4,
    quality: 4,
    speed: 4,
    downloadUrl: 'https://huggingface.co/Qwen/Qwen2.5-3B-Instruct-GGUF/resolve/main/qwen2.5-3b-instruct-q4_k_m.gguf',
    filename: 'qwen-2.5-3b-q4.gguf',
  },
  'mistral-7b': {
    model: 'mistral-7b',
    displayName: 'Mistral 7B',
    description: 'Modèle premium, meilleure qualité mais plus lourd',
    sizeGB: 4.0,
    ramRequired: 6,
    quality: 5,
    speed: 3,
    downloadUrl: 'https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf',
    filename: 'mistral-7b-q4.gguf',
  },
};

/**
 * État complet du service LLM
 */
export interface LLMState {
  status: LLMStatus;
  currentModel: LLMModel | null;
  config: LLMConfig;
  downloadProgress: LLMDownloadProgress | null;
  lastError: string | null;
  stats: {
    totalGenerations: number;
    totalTokensGenerated: number;
    averageTokensPerSecond: number;
  };
}
