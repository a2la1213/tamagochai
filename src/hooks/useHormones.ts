// src/hooks/useHormones.ts
// Hook pour accéder au système hormonal

import { useCallback, useEffect, useState } from 'react';
import { useTamagochaiStore } from '../stores';
import { hormoneService } from '../services/core';
import { HormoneType, HormoneLevels, HormoneSummary } from '../types';
import { HORMONE_CONFIGS, HORMONE_MODIFIERS } from '../constants';
import { formatHormoneName } from '../utils';

export function useHormones() {
  const tamagochai = useTamagochaiStore(state => state.tamagochai);
  const refreshHormones = useTamagochaiStore(state => state.refreshHormones);
  
  const [summary, setSummary] = useState<HormoneSummary | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!tamagochai) return;
    
    try {
      const sum = await hormoneService.getSummary(tamagochai.id);
      setSummary(sum);
    } catch (error) {
      console.error('[useHormones] fetchSummary error:', error);
    }
  }, [tamagochai?.id]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const applyModifier = useCallback(
    async (modifierName: keyof typeof HORMONE_MODIFIERS) => {
      if (!tamagochai) return;

      try {
        await hormoneService.applyPredefinedModifier(tamagochai.id, modifierName);
        await refreshHormones();
        await fetchSummary();
      } catch (error) {
        console.error('[useHormones] applyModifier error:', error);
      }
    },
    [tamagochai?.id, refreshHormones, fetchSummary]
  );

  const modifyHormone = useCallback(
    async (hormone: HormoneType, delta: number, source: string) => {
      if (!tamagochai) return;

      try {
        await hormoneService.modifyHormone(tamagochai.id, hormone, delta, source);
        await refreshHormones();
        await fetchSummary();
      } catch (error) {
        console.error('[useHormones] modifyHormone error:', error);
      }
    },
    [tamagochai?.id, refreshHormones, fetchSummary]
  );

  const getLevel = useCallback(
    (hormone: HormoneType): number => {
      return tamagochai?.hormones?.[hormone] ?? 50;
    },
    [tamagochai?.hormones]
  );

  const interpretLevel = useCallback(
    (hormone: HormoneType) => {
      const level = getLevel(hormone);
      return hormoneService.interpretLevel(hormone, level);
    },
    [getLevel]
  );

  const getDescription = useCallback((): string => {
    if (!tamagochai?.hormones) return 'État inconnu';
    return hormoneService.describeState(tamagochai.hormones);
  }, [tamagochai?.hormones]);

  const getHormoneInfo = useCallback((hormone: HormoneType) => {
    const config = HORMONE_CONFIGS[hormone];
    const level = getLevel(hormone);
    const interpretation = interpretLevel(hormone);

    return {
      name: formatHormoneName(hormone),
      description: config.description,
      level,
      baseline: config.baseline,
      interpretation,
      isHigh: level > config.baseline + 20,
      isLow: level < config.baseline - 20,
    };
  }, [getLevel, interpretLevel]);

  return {
    levels: tamagochai?.hormones ?? null,
    summary,
    dominantHormone: summary?.dominant ?? null,
    
    refresh: refreshHormones,
    applyModifier,
    modifyHormone,
    
    getLevel,
    interpretLevel,
    getDescription,
    getHormoneInfo,
    
    hormoneTypes: Object.keys(HORMONE_CONFIGS) as HormoneType[],
  };
}

export default useHormones;
