// src/stores/useTamagochaiStore.ts
// Store principal du TamagochAI

import { create } from 'zustand';
import {
  TamagochaiState,
  Genome,
  AvatarConfig,
  EvolutionStage,
  HormoneLevels,
  EmotionState,
  TamagochaiStats,
  CreateTamagochaiConfig,
} from '../types';
import {
  createTamagochai,
  getActiveTamagochai,
  updateName,
  updateAvatar,
  updateLastInteraction,
  markFirstLaunchComplete,
  getStats,
  tamagochaiExists,
} from '../services/database';
import { hormoneService, emotionService, evolutionService } from '../services/core';
import { DEFAULT_HORMONE_LEVELS } from '../constants';

interface TamagochaiStore {
  // État
  tamagochai: TamagochaiState | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions d'initialisation
  initialize: () => Promise<void>;
  createNew: (config: CreateTamagochaiConfig) => Promise<string>;
  reset: () => void;

  // Actions de mise à jour
  setName: (name: string) => Promise<void>;
  setAvatar: (avatar: Partial<AvatarConfig>) => Promise<void>;
  completeFirstLaunch: () => Promise<void>;
  refreshStats: () => Promise<void>;

  // Actions hormones/émotions
  refreshHormones: () => Promise<void>;
  refreshEmotion: () => Promise<void>;
  refreshAll: () => Promise<void>;

  // Actions évolution
  refreshEvolution: () => Promise<void>;

  // Helpers
  exists: () => Promise<boolean>;
}

export const useTamagochaiStore = create<TamagochaiStore>((set, get) => ({
  // État initial
  tamagochai: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  // Initialise le store depuis la base de données
  initialize: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await getActiveTamagochai();

      if (data) {
        // Récupérer les hormones et calculer l'émotion
        const hormones = await hormoneService.getLevels(data.id!);
        const emotion = await emotionService.calculateEmotion(data.id!);
        const progress = await evolutionService.getProgress(data.id!);
        const stats = await getStats(data.id!);

        const tamagochai: TamagochaiState = {
          id: data.id!,
          name: data.name!,
          genome: data.genome!,
          avatar: data.avatar!,
          stats: stats || data.stats!,
          hormones: hormones,
          emotion: emotion,
          stage: data.stage!,
          xp: data.xp!,
          createdAt: data.createdAt!,
          lastInteractionAt: data.lastInteractionAt!,
          isFirstLaunch: data.isFirstLaunch!,
        };

        set({ tamagochai, isInitialized: true, isLoading: false });

        // Démarrer le decay automatique des hormones
        hormoneService.startAutoDecay(data.id!);
      } else {
        set({ tamagochai: null, isInitialized: true, isLoading: false });
      }
    } catch (error) {
      console.error('[TamagochaiStore] Initialize error:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Crée un nouveau TamagochAI
  createNew: async (config: CreateTamagochaiConfig) => {
    set({ isLoading: true, error: null });

    try {
      const id = await createTamagochai(config);

      // Recharger les données
      await get().initialize();

      return id;
    } catch (error) {
      console.error('[TamagochaiStore] Create error:', error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Réinitialise le store
  reset: () => {
    hormoneService.stopAutoDecay();
    set({
      tamagochai: null,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  },

  // Met à jour le nom
  setName: async (name: string) => {
    const { tamagochai } = get();
    if (!tamagochai) return;

    try {
      await updateName(tamagochai.id, name);
      set({ tamagochai: { ...tamagochai, name } });
    } catch (error) {
      console.error('[TamagochaiStore] setName error:', error);
    }
  },

  // Met à jour l'avatar
  setAvatar: async (avatar: Partial<AvatarConfig>) => {
    const { tamagochai } = get();
    if (!tamagochai) return;

    try {
      await updateAvatar(tamagochai.id, avatar);
      set({
        tamagochai: {
          ...tamagochai,
          avatar: { ...tamagochai.avatar, ...avatar },
        },
      });
    } catch (error) {
      console.error('[TamagochaiStore] setAvatar error:', error);
    }
  },

  // Marque le premier lancement comme terminé
  completeFirstLaunch: async () => {
    const { tamagochai } = get();
    if (!tamagochai) return;

    try {
      await markFirstLaunchComplete(tamagochai.id);
      set({ tamagochai: { ...tamagochai, isFirstLaunch: false } });
    } catch (error) {
      console.error('[TamagochaiStore] completeFirstLaunch error:', error);
    }
  },

  // Rafraîchit les statistiques
  refreshStats: async () => {
    const { tamagochai } = get();
    if (!tamagochai) return;

    try {
      const stats = await getStats(tamagochai.id);
      if (stats) {
        set({ tamagochai: { ...tamagochai, stats } });
      }
    } catch (error) {
      console.error('[TamagochaiStore] refreshStats error:', error);
    }
  },

  // Rafraîchit les hormones
  refreshHormones: async () => {
    const { tamagochai } = get();
    if (!tamagochai) return;

    try {
      const hormones = await hormoneService.applyDecay(tamagochai.id);
      set({ tamagochai: { ...tamagochai, hormones } });
    } catch (error) {
      console.error('[TamagochaiStore] refreshHormones error:', error);
    }
  },

  // Rafraîchit l'émotion
  refreshEmotion: async () => {
    const { tamagochai } = get();
    if (!tamagochai) return;

    try {
      const emotion = await emotionService.calculateEmotion(tamagochai.id);
      set({ tamagochai: { ...tamagochai, emotion } });
    } catch (error) {
      console.error('[TamagochaiStore] refreshEmotion error:', error);
    }
  },

  // Rafraîchit l'évolution
  refreshEvolution: async () => {
    const { tamagochai } = get();
    if (!tamagochai) return;

    try {
      const progress = await evolutionService.getProgress(tamagochai.id);
      set({
        tamagochai: {
          ...tamagochai,
          stage: progress.currentStage,
          xp: progress.currentXP,
        },
      });
    } catch (error) {
      console.error('[TamagochaiStore] refreshEvolution error:', error);
    }
  },

  // Rafraîchit tout
  refreshAll: async () => {
    const { refreshHormones, refreshEmotion, refreshEvolution, refreshStats } = get();
    await refreshHormones();
    await refreshEmotion();
    await refreshEvolution();
    await refreshStats();
    await updateLastInteraction(get().tamagochai!.id);
  },

  // Vérifie si un TamagochAI existe
  exists: async () => {
    return tamagochaiExists();
  },
}));

export default useTamagochaiStore;
