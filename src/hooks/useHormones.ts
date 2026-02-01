// src/hooks/useHormones.ts
// Hook pour accéder au système hormonal

import { useCallback, useEffect, useState } from 'react';
import { useTamagochaiStore } from '../stores';
import { hormoneService } from '../services/core';
import { HormoneType, HormoneLevels, HormoneSummary } from '../types';
import { HORMONE_CONFIGS, HORMONE_MODIFIERS } from '../constants';
import { formatHormoneName } from '../utils';

/**
 * Hook pour accéder aux hormones du TamagochAI
 */
export function useHormones() {
  const tamagochai = useTamagochaiStore(state => state.tamagochai);
  const refreshHormones = useTamagochaiStore(state => state.refreshHormones);
  
  const [summary, setSummary] = useState<HormoneSummary | null>(null);

  // Récupérer le résumé hormonal
  const fetchSummary = useCallback(async () => {
    if (!tamagochai) return;
    
    try {
      const sum = await hormoneService.getSummary(tamagochai.id);
      setSummary(sum);
    } catch (error) {
      console.error('[useHormones] fetchSummary error:', error);
    }
  }, [tamagochai?.id]);

  // Rafraîchir au montage et quand le tamagochai change
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Appliquer un modificateur prédéfini
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

  // Modifier une hormone spécifique
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

  // Obtenir le niveau d'une hormone
  const getLevel = useCallback(
    (hormone: HormoneType): number => {
      return tamagochai?.hormones?.[hormone] ?? 50;
    },
    [tamagochai?.hormones]
  );

  // Obtenir l'interprétation d'un niveau
  const interpretLevel = useCallback(
    (hormone: HormoneType) => {
      const level = getLevel(hormone);
      return hormoneService.interpretLevel(hormone, level);
    },
    [getLevel]
  );

  // Obtenir la description textuelle
  const getDescription = useCallback((): string => {
    if (!tamagochai?.hormones) return 'État inconnu';
    return hormoneService.describeState(tamagochai.hormones);
  }, [tamagochai?.hormones]);

  // Obtenir les infos d'une hormone
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
    // Données
    levels: tamagochai?.hormones ?? null,
    summary,
    
    // Actions
    refresh: refreshHormones,
    applyModifier,
    modifyHormone,
    
    // Helpers
    getLevel,
    interpretLevel,
    getDescription,
    getHormoneInfo,
    
    // Liste des hormones
    hormoneTypes: Object.keys(HORMONE_CONFIGS) as HormoneType[],
  };
}

export default useHormones;
