// src/services/core/EvolutionService.ts
// Service de gestion de l'évolution et de l'XP

import {
  EvolutionStage,
  XPSource,
  XPEvent,
  EvolutionProgress,
  DevelopmentMode,
} from '../../types';
import {
  EVOLUTION_STAGES,
  XP_SOURCES,
  STAGE_ORDER,
  getNextStage,
  getStageForXP,
  APP_CONFIG,
} from '../../constants';
import {
  addXP as dbAddXP,
  updateStage,
  getActiveTamagochai,
} from '../database';
import { generateUUID, daysBetween } from '../../utils';
import { XP_MULTIPLIERS } from '../../types';

/**
 * Service de gestion de l'évolution
 */
class EvolutionService {
  private static instance: EvolutionService;
  private cooldowns: Map<string, Date> = new Map();
  private dailyCounts: Map<string, number> = new Map();
  private lastDayReset: Date = new Date();

  private constructor() {}

  public static getInstance(): EvolutionService {
    if (!EvolutionService.instance) {
      EvolutionService.instance = new EvolutionService();
    }
    return EvolutionService.instance;
  }

  /**
   * Obtient le multiplicateur XP selon le mode de développement
   */
  public getMultiplier(): number {
    const mode = APP_CONFIG.developmentMode as DevelopmentMode;
    return XP_MULTIPLIERS[mode];
  }

  /**
   * Attribue de l'XP pour une source donnée
   */
  public async grantXP(
    tamagochaiId: string,
    source: XPSource,
    metadata?: Record<string, any>
  ): Promise<XPEvent | null> {
    // Vérifier le cooldown
    if (!this.checkCooldown(tamagochaiId, source)) {
      return null;
    }

    // Vérifier la limite journalière
    if (!this.checkDailyLimit(tamagochaiId, source)) {
      return null;
    }

    const config = XP_SOURCES[source];
    const multiplier = this.getMultiplier();
    const amount = Math.floor(config.baseXP * multiplier);

    // Ajouter l'XP en base
    const newTotal = await dbAddXP(tamagochaiId, amount);

    // Mettre à jour le cooldown
    this.setCooldown(tamagochaiId, source);

    // Incrémenter le compteur journalier
    this.incrementDailyCount(tamagochaiId, source);

    // Vérifier l'évolution
    await this.checkEvolution(tamagochaiId, newTotal);

    const event: XPEvent = {
      id: generateUUID(),
      source,
      amount,
      baseAmount: config.baseXP,
      multiplier,
      metadata,
      timestamp: new Date(),
    };

    return event;
  }

  /**
   * Vérifie et applique une évolution si nécessaire
   */
  public async checkEvolution(
    tamagochaiId: string,
    currentXP: number
  ): Promise<{ evolved: boolean; newStage?: EvolutionStage }> {
    const tamagochai = await getActiveTamagochai();
    if (!tamagochai) return { evolved: false };

    const currentStage = tamagochai.stage!;
    const expectedStage = getStageForXP(currentXP);

    if (expectedStage !== currentStage) {
      const currentIndex = STAGE_ORDER.indexOf(currentStage);
      const expectedIndex = STAGE_ORDER.indexOf(expectedStage);

      // Seulement évoluer vers le haut
      if (expectedIndex > currentIndex) {
        await updateStage(tamagochaiId, expectedStage);
        return { evolved: true, newStage: expectedStage };
      }
    }

    return { evolved: false };
  }

  /**
   * Calcule la progression actuelle
   */
  public async getProgress(tamagochaiId: string): Promise<EvolutionProgress> {
    const tamagochai = await getActiveTamagochai();
    if (!tamagochai) {
      return this.getDefaultProgress();
    }

    const currentXP = tamagochai.xp || 0;
    const currentStage = tamagochai.stage || 'emergence';
    const stageConfig = EVOLUTION_STAGES[currentStage];
    const nextStage = getNextStage(currentStage);

    // XP dans le stade actuel
    const xpInCurrentStage = currentXP - stageConfig.xpRequired;

    // XP nécessaire pour le prochain stade
    const xpForNextStage = stageConfig.xpToNext;

    // Pourcentage de progression
    let percentage = 0;
    if (xpForNextStage) {
      percentage = Math.min(100, (xpInCurrentStage / xpForNextStage) * 100);
    } else {
      percentage = 100; // Stade final
    }

    // Estimation du temps restant (basé sur le gain moyen)
    const estimatedDaysRemaining = this.estimateDaysRemaining(
      xpForNextStage ? xpForNextStage - xpInCurrentStage : 0
    );

    return {
      currentStage,
      currentXP,
      xpInCurrentStage,
      xpForNextStage,
      percentage,
      nextStage,
      estimatedDaysRemaining,
    };
  }

  /**
   * Obtient la configuration d'un stade
   */
  public getStageConfig(stage: EvolutionStage) {
    return EVOLUTION_STAGES[stage];
  }

  /**
   * Obtient la configuration d'une source d'XP
   */
  public getSourceConfig(source: XPSource) {
    return XP_SOURCES[source];
  }

  /**
   * Vérifie si un cooldown est actif
   */
  private checkCooldown(tamagochaiId: string, source: XPSource): boolean {
    const key = `${tamagochaiId}:${source}`;
    const lastGrant = this.cooldowns.get(key);

    if (!lastGrant) return true;

    const config = XP_SOURCES[source];
    const elapsedSeconds = (Date.now() - lastGrant.getTime()) / 1000;

    return elapsedSeconds >= config.cooldown;
  }

  /**
   * Définit le cooldown
   */
  private setCooldown(tamagochaiId: string, source: XPSource): void {
    const key = `${tamagochaiId}:${source}`;
    this.cooldowns.set(key, new Date());
  }

  /**
   * Vérifie la limite journalière
   */
  private checkDailyLimit(tamagochaiId: string, source: XPSource): boolean {
    this.resetDailyCountsIfNeeded();

    const config = XP_SOURCES[source];
    if (!config.dailyLimit) return true;

    const key = `${tamagochaiId}:${source}`;
    const currentCount = this.dailyCounts.get(key) || 0;

    return currentCount < config.dailyLimit;
  }

  /**
   * Incrémente le compteur journalier
   */
  private incrementDailyCount(tamagochaiId: string, source: XPSource): void {
    const key = `${tamagochaiId}:${source}`;
    const currentCount = this.dailyCounts.get(key) || 0;
    this.dailyCounts.set(key, currentCount + 1);
  }

  /**
   * Réinitialise les compteurs journaliers si nécessaire
   */
  private resetDailyCountsIfNeeded(): void {
    const now = new Date();
    if (daysBetween(this.lastDayReset, now) >= 1) {
      this.dailyCounts.clear();
      this.lastDayReset = now;
    }
  }

  /**
   * Estime le nombre de jours restants
   */
  private estimateDaysRemaining(xpRemaining: number): number | undefined {
    if (xpRemaining <= 0) return 0;

    // Estimation basée sur ~200 XP/jour en moyenne (mode production)
    const avgXPPerDay = 200 * this.getMultiplier();
    return Math.ceil(xpRemaining / avgXPPerDay);
  }

  /**
   * Retourne une progression par défaut
   */
  private getDefaultProgress(): EvolutionProgress {
    return {
      currentStage: 'emergence',
      currentXP: 0,
      xpInCurrentStage: 0,
      xpForNextStage: 1000,
      percentage: 0,
      nextStage: 'learning',
      estimatedDaysRemaining: undefined,
    };
  }

  /**
   * Obtient tous les stades avec leur statut
   */
  public async getAllStagesStatus(
    tamagochaiId: string
  ): Promise<{ stage: EvolutionStage; unlocked: boolean; current: boolean }[]> {
    const tamagochai = await getActiveTamagochai();
    const currentStage = tamagochai?.stage || 'emergence';
    const currentIndex = STAGE_ORDER.indexOf(currentStage);

    return STAGE_ORDER.map((stage, index) => ({
      stage,
      unlocked: index <= currentIndex,
      current: stage === currentStage,
    }));
  }

  /**
   * Force une évolution (debug uniquement)
   */
  public async forceEvolution(
    tamagochaiId: string,
    targetStage: EvolutionStage
  ): Promise<void> {
    const targetXP = EVOLUTION_STAGES[targetStage].xpRequired;
    await dbAddXP(tamagochaiId, targetXP);
    await updateStage(tamagochaiId, targetStage);
  }

  /**
   * Réinitialise tous les cooldowns (debug)
   */
  public resetAllCooldowns(): void {
    this.cooldowns.clear();
    this.dailyCounts.clear();
  }
}

export const evolutionService = EvolutionService.getInstance();
export default evolutionService;
