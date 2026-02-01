// src/hooks/useEvolution.ts
// Hook pour accéder au système d'évolution et XP

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useTamagochaiStore } from '../stores';
import { evolutionService } from '../services/core';
import { EvolutionStage, XPSource, EvolutionProgress, XPEvent } from '../types';
import { EVOLUTION_STAGES, XP_SOURCES, STAGE_ORDER } from '../constants';
import { formatXP, formatStageName } from '../utils';

export function useEvolution() {
  const tamagochai = useTamagochaiStore(state => state.tamagochai);
  const refreshEvolution = useTamagochaiStore(state => state.refreshEvolution);

  const [progress, setProgress] = useState<EvolutionProgress | null>(null);
  const [stagesStatus, setStagesStatus] = useState<
    { stage: EvolutionStage; unlocked: boolean; current: boolean }[]
  >([]);

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

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const currentStage = tamagochai?.stage ?? 'emergence';
  const totalXP = tamagochai?.xp ?? 0;

  const stageConfig = useMemo(() => {
    return EVOLUTION_STAGES[currentStage];
  }, [currentStage]);

  const nextStage = progress?.nextStage ?? null;

  const nextStageConfig = useMemo(() => {
    return nextStage ? EVOLUTION_STAGES[nextStage] : null;
  }, [nextStage]);

  const percentage = progress?.percentage ?? 0;

  const xpRemaining = useMemo(() => {
    if (!progress?.xpForNextStage) return 0;
    return Math.max(0, progress.xpForNextStage - progress.xpInCurrentStage);
  }, [progress]);

  const isFinalStage = currentStage === 'transcendence';
  const multiplier = evolutionService.getMultiplier();

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

  const formattedXP = useMemo(() => {
    return formatXP(totalXP);
  }, [totalXP]);

  const formattedXPRemaining = useMemo(() => {
    return formatXP(xpRemaining);
  }, [xpRemaining]);

  const allSources = useMemo(() => {
    return Object.keys(XP_SOURCES) as XPSource[];
  }, []);

  const estimatedDaysRemaining = progress?.estimatedDaysRemaining;

  return {
    currentStage,
    totalXP,
    progress,
    percentage,
    xpRemaining,
    multiplier,
    stageConfig,
    nextStage,
    nextStageConfig,
    stagesStatus,
    isFinalStage,
    formattedXP,
    formattedXPRemaining,
    estimatedDaysRemaining,
    grantXP,
    refresh: refreshEvolution,
    reload: loadProgress,
    getStageInfo,
    getSourceInfo,
    allStages: STAGE_ORDER,
    allSources,
  };
}

export default useEvolution;
