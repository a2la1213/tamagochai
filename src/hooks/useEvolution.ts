// src/hooks/useEvolution.ts
// Hook pour accéder au système d'évolution et XP

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useTamagochaiStore } from '../stores';
import { evolutionService } from '../services/core';
import { EvolutionStage, XPSource, EvolutionProgress, XPEvent } from '../types';
import { EVOLUTION_STAGES, XP_SOURCES, STAGE_ORDER } from '../constants';
import { formatXP, formatStageName } from '../utils';

/**
 * Hook pour accéder à l'évolution du TamagochAI
 */
export function useEvolution() {
  const tamagochai = useTamagochaiStore(state => state.tamagochai);
  const refreshEvolution = useTamagochaiStore(state => state.refreshEvolution);

  const [progress, setProgress] = useState<EvolutionProgress | null>(null);
  const [stagesStatus, setStagesStatus] = useState<
    { stage: EvolutionStage; unlocked: boolean; current: boolean }[]
  >([]);

  // Charger la progression
  const loadProgress = useCallback(async () => {
    if (!tamagochai) return;

    try {
      const prog = await evolutionService.getProgress(tamagochai.id);
      setProgress(prog);

      const status = await evolutionService.getAllStagesStatus(tamagochai.id);
      setStagesStatus(status);
    } catch (error) {
      console.error('[useEvolution] loadProgress error:', error);
    }
  }, [tamagochai?.id]);

  // Charger au montage
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Stade actuel
  const currentStage = tamagochai?.stage ?? 'emergence';

  // XP total
  const totalXP = tamagochai?.xp ?? 0;

  // Config du stade actuel
  const stageConfig = useMemo(() => {
    return EVOLUTION_STAGES[currentStage];
  }, [currentStage]);

  // Prochain stade
  const nextStage = progress?.nextStage ?? null;

  // Config du prochain stade
  const nextStageConfig = useMemo(() => {
    return nextStage ? EVOLUTION_STAGES[nextStage] : null;
  }, [nextStage]);

  // Pourcentage de progression
  const percentage = progress?.percentage ?? 0;

  // XP restant pour évoluer
  const xpRemaining = useMemo(() => {
    if (!progress?.xpForNextStage) return 0;
    return Math.max(0, progress.xpForNextStage - progress.xpInCurrentStage);
  }, [progress]);

  // Est au stade final ?
  const isFinalStage = currentStage === 'transcendence';

  // Multiplicateur actuel
  const multiplier = evolutionService.getMultiplier();

  // Accorder de l'XP
  const grantXP = useCallback(
    async (source: XPSource, metadata?: Record<string, any>): Promise<XPEvent | null> => {
      if (!tamagochai) return null;

      try {
        const event = await evolutionService.grantXP(tamagochai.id, source, metadata);

        if (event) {
          await refreshEvolution();
          await loadProgress();
        }

        return event;
      } catch (error) {
        console.error('[useEvolution] grantXP error:', error);
        return null;
      }
    },
    [tamagochai?.id, refreshEvolution, loadProgress]
  );

  // Obtenir les infos d'un stade
  const getStageInfo = useCallback((stage: EvolutionStage) => {
    const config = EVOLUTION_STAGES[stage];
    const index = STAGE_ORDER.indexOf(stage);
    const currentIndex = STAGE_ORDER.indexOf(currentStage);

    return {
      stage,
      name: formatStageName(stage),
      displayName: config.displayName,
      description: config.description,
      xpRequired: config.xpRequired,
      xpToNext: config.xpToNext,
      durationEstimate: config.durationEstimate,
      vocabularySize: config.vocabularySize,
      traits: config.traits,
      unlocks: config.unlocks,
      isUnlocked: index <= currentIndex,
      isCurrent: stage === currentStage,
      isPast: index < currentIndex,
      isFuture: index > currentIndex,
    };
  }, [currentStage]);

  // Obtenir les infos d'une source d'XP
  const getSourceInfo = useCallback((source: XPSource) => {
    const config = XP_SOURCES[source];
    return {
      source,
      baseXP: config.baseXP,
      actualXP: Math.floor(config.baseXP * multiplier),
      cooldown: config.cooldown,
      dailyLimit: config.dailyLimit,
      description: config.description,
    };
  }, [multiplier]);

  // Formater l'XP actuel
  const formattedXP = useMemo(() => {
    return formatXP(totalXP);
  }, [totalXP]);

  // Formater l'XP restant
  const formattedXPRemaining = useMemo(() => {
    return formatXP(xpRemaining);
  }, [xpRemaining]);

  // Liste de toutes les sources d'XP
  const allSources = useMemo(() => {
    return Object.keys(XP_SOURCES) as XPSource[];
  }, []);

  // Jours estimés restants
  const estimatedDaysRemaining = progress?.estimatedDaysRemaining;

  return {
    // État
    currentStage,
    totalXP,
    progress,
    percentage,
    xpRemaining,
    multiplier,

    // Stades
    stageConfig,
    nextStage,
    nextStageConfig,
    stagesStatus,
    isFinalStage,

    // Formaté
    formattedXP,
    formattedXPRemaining,
    estimatedDaysRemaining,

    // Actions
    grantXP,
    refresh: refreshEvolution,
    reload: loadProgress,

    // Helpers
    getStageInfo,
    getSourceInfo,

    // Données
    allStages: STAGE_ORDER,
    allSources,
  };
}

export default useEvolution;
