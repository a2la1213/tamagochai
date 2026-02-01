// src/services/core/HormoneService.ts
// Service de gestion du système hormonal

import {
  HormoneType,
  HormoneLevels,
  HormoneState,
  HormoneModifier,
  HormoneSummary,
} from '../../types';
import {
  HORMONE_CONFIGS,
  DEFAULT_HORMONE_LEVELS,
  HORMONE_THRESHOLDS,
  HORMONE_MODIFIERS,
  applyDecayToBaseline,
} from '../../constants';
import {
  getHormoneState,
  getHormoneLevels,
  updateHormoneLevels,
  applyModifiers as dbApplyModifiers,
  updateLastDecay,
  recordHormoneHistory,
  getDominantHormone,
} from '../database';
import { clamp, minutesBetween } from '../../utils';

class HormoneService {
  private static instance: HormoneService;
  private decayIntervalId: ReturnType<typeof setInterval> | null = null;

  private constructor() {}

  public static getInstance(): HormoneService {
    if (!HormoneService.instance) {
      HormoneService.instance = new HormoneService();
    }
    return HormoneService.instance;
  }

  public async getLevels(tamagochaiId: string): Promise<HormoneLevels> {
    return getHormoneLevels(tamagochaiId);
  }

  public async getState(tamagochaiId: string): Promise<HormoneState | null> {
    return getHormoneState(tamagochaiId);
  }

  public async applyModifiers(
    tamagochaiId: string,
    modifiers: HormoneModifier[],
    trigger: string
  ): Promise<HormoneLevels> {
    return dbApplyModifiers(tamagochaiId, modifiers, trigger);
  }

  public async applyPredefinedModifier(
    tamagochaiId: string,
    modifierName: keyof typeof HORMONE_MODIFIERS
  ): Promise<HormoneLevels> {
    const predefinedModifiers = HORMONE_MODIFIERS[modifierName];
    const modifiers: HormoneModifier[] = predefinedModifiers.map(m => ({
      hormone: m.hormone,
      delta: m.delta,
      source: m.source,
    }));
    return this.applyModifiers(tamagochaiId, modifiers, modifierName);
  }

  public async applyDecay(tamagochaiId: string): Promise<HormoneLevels> {
    const state = await getHormoneState(tamagochaiId);
    if (!state) return DEFAULT_HORMONE_LEVELS;

    const now = new Date();
    const elapsedMinutes = minutesBetween(state.lastDecay, now);

    if (elapsedMinutes < 1) return state.levels;

    const newLevels: HormoneLevels = { ...state.levels };

    for (const hormone of Object.keys(newLevels) as HormoneType[]) {
      newLevels[hormone] = applyDecayToBaseline(
        state.levels[hormone],
        hormone,
        elapsedMinutes
      );
    }

    await updateHormoneLevels(tamagochaiId, newLevels);
    await updateLastDecay(tamagochaiId);

    return newLevels;
  }

  public async modifyHormone(
    tamagochaiId: string,
    hormone: HormoneType,
    delta: number,
    source: string
  ): Promise<number> {
    const levels = await getHormoneLevels(tamagochaiId);
    const newValue = clamp(levels[hormone] + delta, 0, 100);
    
    levels[hormone] = newValue;
    await updateHormoneLevels(tamagochaiId, levels);
    await recordHormoneHistory(tamagochaiId, levels, source);

    return newValue;
  }

  public async getSummary(tamagochaiId: string): Promise<HormoneSummary> {
    const levels = await getHormoneLevels(tamagochaiId);
    const dominantResult = await getDominantHormone(tamagochaiId);

    const balanceState = this.calculateBalanceState(levels);
    const alerts = this.detectAlerts(levels);

    return {
      dominant: dominantResult.hormone,
      dominantLevel: dominantResult.level,
      balanceState,
      alerts,
      levels,
    };
  }

  private calculateBalanceState(
    levels: HormoneLevels
  ): 'balanced' | 'stressed' | 'happy' | 'low_energy' {
    const { dopamine, serotonin, cortisol, adrenaline } = levels;

    if (cortisol > 60 || adrenaline > 50) {
      return 'stressed';
    }

    if (dopamine > 70 && serotonin > 70) {
      return 'happy';
    }

    if (dopamine < 30 && serotonin < 40) {
      return 'low_energy';
    }

    return 'balanced';
  }

  private detectAlerts(levels: HormoneLevels): HormoneType[] {
    const alerts: HormoneType[] = [];

    for (const [hormone, level] of Object.entries(levels)) {
      if (level <= HORMONE_THRESHOLDS.critical_low || level >= HORMONE_THRESHOLDS.critical_high) {
        alerts.push(hormone as HormoneType);
      }
    }

    return alerts;
  }

  public interpretLevel(
    hormone: HormoneType,
    level: number
  ): 'critical_low' | 'low' | 'normal' | 'high' | 'critical_high' {
    if (level <= HORMONE_THRESHOLDS.critical_low) return 'critical_low';
    if (level <= HORMONE_THRESHOLDS.low) return 'low';
    if (level >= HORMONE_THRESHOLDS.critical_high) return 'critical_high';
    if (level >= HORMONE_THRESHOLDS.high) return 'high';
    return 'normal';
  }

  public describeState(levels: HormoneLevels): string {
    const dominant = this.findDominantHormone(levels);
    const balance = this.calculateBalanceState(levels);

    const descriptions: Record<string, string> = {
      dopamine: 'motivé et enthousiaste',
      serotonin: 'serein et équilibré',
      oxytocin: 'affectueux et connecté',
      cortisol: 'stressé et tendu',
      adrenaline: 'excité et alerte',
      endorphins: 'joyeux et euphorique',
    };

    const balanceDesc: Record<string, string> = {
      balanced: 'équilibré',
      stressed: 'un peu stressé',
      happy: 'très heureux',
      low_energy: 'fatigué',
    };

    return `Je me sens ${descriptions[dominant]} et globalement ${balanceDesc[balance]}.`;
  }

  private findDominantHormone(levels: HormoneLevels): HormoneType {
    const baselines: Record<HormoneType, number> = {
      dopamine: 50,
      serotonin: 60,
      oxytocin: 55,
      cortisol: 25,
      adrenaline: 20,
      endorphins: 40,
    };

    let dominant: HormoneType = 'dopamine';
    let maxDeviation = 0;

    for (const [hormone, level] of Object.entries(levels)) {
      const baseline = baselines[hormone as HormoneType];
      const deviation = Math.abs(level - baseline);
      if (deviation > maxDeviation) {
        maxDeviation = deviation;
        dominant = hormone as HormoneType;
      }
    }

    return dominant;
  }

  public startAutoDecay(tamagochaiId: string, intervalMs: number = 60000): void {
    if (this.decayIntervalId) {
      clearInterval(this.decayIntervalId);
    }

    this.decayIntervalId = setInterval(() => {
      this.applyDecay(tamagochaiId).catch(console.error);
    }, intervalMs);
  }

  public stopAutoDecay(): void {
    if (this.decayIntervalId) {
      clearInterval(this.decayIntervalId);
      this.decayIntervalId = null;
    }
  }
}

export const hormoneService = HormoneService.getInstance();
export default hormoneService;
