// src/services/core/EmotionService.ts
// Service de gestion des émotions (calculées depuis les hormones)

import {
  EmotionType,
  EmotionState,
  EmotionIntensity,
  HormoneLevels,
} from '../../types';
import {
  EMOTION_CONFIGS,
  EMOTION_TO_EXPRESSION,
  EMOTION_INTENSITY_THRESHOLDS,
  POSITIVE_EMOTIONS,
  NEGATIVE_EMOTIONS,
} from '../../constants';
import { hormoneService } from './HormoneService';
import { clamp } from '../../utils';

/**
 * Service de gestion des émotions
 */
class EmotionService {
  private static instance: EmotionService;
  private currentEmotion: EmotionState | null = null;
  private emotionHistory: { emotion: EmotionType; timestamp: Date }[] = [];

  private constructor() {}

  public static getInstance(): EmotionService {
    if (!EmotionService.instance) {
      EmotionService.instance = new EmotionService();
    }
    return EmotionService.instance;
  }

  /**
   * Calcule l'émotion actuelle depuis les niveaux hormonaux
   */
  public async calculateEmotion(tamagochaiId: string): Promise<EmotionState> {
    const hormones = await hormoneService.getLevels(tamagochaiId);
    return this.calculateEmotionFromHormones(hormones);
  }

  /**
   * Calcule l'émotion depuis des niveaux hormonaux donnés
   */
  public calculateEmotionFromHormones(hormones: HormoneLevels): EmotionState {
    // Calculer les scores pour chaque émotion
    const scores = this.calculateEmotionScores(hormones);

    // Trouver l'émotion dominante
    let primaryEmotion: EmotionType = 'neutral';
    let maxScore = 0;

    for (const [emotion, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        primaryEmotion = emotion as EmotionType;
      }
    }

    // Trouver l'émotion secondaire
    let secondaryEmotion: EmotionType | undefined;
    let secondMaxScore = 0;

    for (const [emotion, score] of Object.entries(scores)) {
      if (emotion !== primaryEmotion && score > secondMaxScore && score > 30) {
        secondMaxScore = score;
        secondaryEmotion = emotion as EmotionType;
      }
    }

    // Calculer l'intensité
    const intensity = this.calculateIntensity(maxScore);

    // Calculer valence et arousal
    const valence = this.calculateValence(hormones);
    const arousal = this.calculateArousal(hormones);

    const emotionState: EmotionState = {
      primary: primaryEmotion,
      secondary: secondaryEmotion,
      intensity,
      valence,
      arousal,
    };

    // Mettre à jour l'historique
    this.updateHistory(primaryEmotion);
    this.currentEmotion = emotionState;

    return emotionState;
  }

  /**
   * Calcule les scores pour chaque émotion
   */
  private calculateEmotionScores(hormones: HormoneLevels): Record<EmotionType, number> {
    const { dopamine, serotonin, oxytocin, cortisol, adrenaline, endorphins } = hormones;

    return {
      // Joie = (dopamine × 0.4 + sérotonine × 0.4 + endorphines × 0.2) × (1 - cortisol/200)
      happy: (dopamine * 0.4 + serotonin * 0.4 + endorphins * 0.2) * (1 - cortisol / 200),

      // Tristesse = max(0, 60 - sérotonine) × 0.5 + max(0, 50 - dopamine) × 0.3 + cortisol × 0.2
      sad: Math.max(0, 60 - serotonin) * 0.5 + Math.max(0, 50 - dopamine) * 0.3 + cortisol * 0.2,

      // Colère = cortisol × 0.4 + adrénaline × 0.3 + max(0, 40 - sérotonine) × 0.3
      angry: cortisol * 0.4 + adrenaline * 0.3 + Math.max(0, 40 - serotonin) * 0.3,

      // Peur = adrénaline × 0.5 + cortisol × 0.4 + max(0, 50 - ocytocine) × 0.1
      scared: adrenaline * 0.5 + cortisol * 0.4 + Math.max(0, 50 - oxytocin) * 0.1,

      // Amour = ocytocine × 0.7 + endorphines × 0.2 + sérotonine × 0.1
      loving: oxytocin * 0.7 + endorphins * 0.2 + serotonin * 0.1,

      // Excitation = dopamine × 0.4 + adrénaline × 0.4 + endorphines × 0.2
      excited: dopamine * 0.4 + adrenaline * 0.4 + endorphins * 0.2,

      // Fatigue = max(0, 50 - dopamine) × 0.4 + max(0, 50 - adrénaline) × 0.3 + max(0, 50 - serotonin) × 0.3
      tired: Math.max(0, 50 - dopamine) * 0.4 + Math.max(0, 50 - adrenaline) * 0.3 + Math.max(0, 50 - serotonin) * 0.3,

      // Curiosité = dopamine × 0.5 + max(0, 50 - cortisol) × 0.3 + serotonin × 0.2
      curious: dopamine * 0.5 + Math.max(0, 50 - cortisol) * 0.3 + serotonin * 0.2,

      // Confusion = cortisol × 0.4 + max(0, 50 - serotonin) × 0.3 + max(0, 50 - dopamine) × 0.3
      confused: cortisol * 0.4 + Math.max(0, 50 - serotonin) * 0.3 + Math.max(0, 50 - dopamine) * 0.3,

      // Neutre = serotonin proche du baseline et tout est stable
      neutral: Math.max(0, 50 - Math.abs(serotonin - 60)) + Math.max(0, 30 - cortisol),
    };
  }

  /**
   * Calcule l'intensité émotionnelle
   */
  private calculateIntensity(score: number): EmotionIntensity {
    if (score >= EMOTION_INTENSITY_THRESHOLDS.overwhelming * 100) return 'overwhelming';
    if (score >= EMOTION_INTENSITY_THRESHOLDS.strong * 100) return 'strong';
    if (score >= EMOTION_INTENSITY_THRESHOLDS.moderate * 100) return 'moderate';
    return 'subtle';
  }

  /**
   * Calcule la valence (-1 à +1)
   */
  private calculateValence(hormones: HormoneLevels): number {
    const { dopamine, serotonin, oxytocin, cortisol, endorphins } = hormones;

    // Facteurs positifs
    const positive = (dopamine + serotonin + oxytocin + endorphins) / 4;
    // Facteurs négatifs
    const negative = cortisol;

    // Normaliser entre -1 et +1
    return clamp((positive - negative) / 50, -1, 1);
  }

  /**
   * Calcule l'arousal (0 à 1)
   */
  private calculateArousal(hormones: HormoneLevels): number {
    const { dopamine, adrenaline, cortisol } = hormones;

    // L'arousal est basé sur l'activation
    const arousal = (dopamine * 0.3 + adrenaline * 0.5 + cortisol * 0.2) / 100;
    return clamp(arousal, 0, 1);
  }

  /**
   * Met à jour l'historique des émotions
   */
  private updateHistory(emotion: EmotionType): void {
    this.emotionHistory.push({ emotion, timestamp: new Date() });
    // Garder seulement les 100 dernières
    if (this.emotionHistory.length > 100) {
      this.emotionHistory.shift();
    }
  }

  /**
   * Obtient l'émotion actuelle en cache
   */
  public getCurrentEmotion(): EmotionState | null {
    return this.currentEmotion;
  }

  /**
   * Obtient l'expression de l'avatar pour une émotion
   */
  public getExpression(emotion: EmotionType): string {
    return EMOTION_TO_EXPRESSION[emotion];
  }

  /**
   * Obtient la configuration d'une émotion
   */
  public getEmotionConfig(emotion: EmotionType) {
    return EMOTION_CONFIGS[emotion];
  }

  /**
   * Vérifie si une émotion est positive
   */
  public isPositiveEmotion(emotion: EmotionType): boolean {
    return POSITIVE_EMOTIONS.includes(emotion);
  }

  /**
   * Vérifie si une émotion est négative
   */
  public isNegativeEmotion(emotion: EmotionType): boolean {
    return NEGATIVE_EMOTIONS.includes(emotion);
  }

  /**
   * Génère une description textuelle de l'émotion
   */
  public describeEmotion(state: EmotionState): string {
    const config = EMOTION_CONFIGS[state.primary];
    const intensityDesc: Record<EmotionIntensity, string> = {
      subtle: 'légèrement',
      moderate: '',
      strong: 'très',
      overwhelming: 'extrêmement',
    };

    const prefix = intensityDesc[state.intensity];
    const emotionName = config.displayName.toLowerCase();

    if (prefix) {
      return `${prefix} ${emotionName}`;
    }
    return emotionName;
  }

  /**
   * Obtient l'emoji pour une émotion
   */
  public getEmoji(emotion: EmotionType): string {
    return EMOTION_CONFIGS[emotion].emoji;
  }

  /**
   * Obtient la couleur pour une émotion
   */
  public getColor(emotion: EmotionType): string {
    return EMOTION_CONFIGS[emotion].color;
  }

  /**
   * Calcule la stabilité émotionnelle (basée sur l'historique)
   */
  public calculateStability(): number {
    if (this.emotionHistory.length < 5) return 1;

    const recent = this.emotionHistory.slice(-10);
    const uniqueEmotions = new Set(recent.map(e => e.emotion));
    
    // Plus il y a d'émotions différentes, moins c'est stable
    return 1 - (uniqueEmotions.size - 1) / 9; // 9 = max émotions différentes - 1
  }

  /**
   * Obtient l'émotion dominante de l'historique récent
   */
  public getDominantRecentEmotion(): EmotionType {
    if (this.emotionHistory.length === 0) return 'neutral';

    const recent = this.emotionHistory.slice(-20);
    const counts: Record<string, number> = {};

    for (const entry of recent) {
      counts[entry.emotion] = (counts[entry.emotion] || 0) + 1;
    }

    let dominant: EmotionType = 'neutral';
    let maxCount = 0;

    for (const [emotion, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        dominant = emotion as EmotionType;
      }
    }

    return dominant;
  }

  /**
   * Réinitialise l'historique
   */
  public resetHistory(): void {
    this.emotionHistory = [];
    this.currentEmotion = null;
  }
}

export const emotionService = EmotionService.getInstance();
export default emotionService;
