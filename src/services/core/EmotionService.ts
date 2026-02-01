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

  public async calculateEmotion(tamagochaiId: string): Promise<EmotionState> {
    const hormones = await hormoneService.getLevels(tamagochaiId);
    return this.calculateEmotionFromHormones(hormones);
  }

  public calculateEmotionFromHormones(hormones: HormoneLevels): EmotionState {
    const scores = this.calculateEmotionScores(hormones);

    let primaryEmotion: EmotionType = 'neutral';
    let maxScore = 0;

    for (const [emotion, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        primaryEmotion = emotion as EmotionType;
      }
    }

    let secondaryEmotion: EmotionType | null = null;
    let secondMaxScore = 0;

    for (const [emotion, score] of Object.entries(scores)) {
      if (emotion !== primaryEmotion && score > secondMaxScore && score > 30) {
        secondMaxScore = score;
        secondaryEmotion = emotion as EmotionType;
      }
    }

    const intensity = this.calculateIntensity(maxScore);
    const valence = this.calculateValence(hormones);
    const arousal = this.calculateArousal(hormones);

    const emotionState: EmotionState = {
      primary: primaryEmotion,
      secondary: secondaryEmotion,
      intensity,
      valence,
      arousal,
    };

    this.updateHistory(primaryEmotion);
    this.currentEmotion = emotionState;

    return emotionState;
  }

  private calculateEmotionScores(hormones: HormoneLevels): Record<EmotionType, number> {
    const { dopamine, serotonin, oxytocin, cortisol, adrenaline, endorphins } = hormones;

    return {
      happy: (dopamine * 0.4 + serotonin * 0.4 + endorphins * 0.2) * (1 - cortisol / 200),
      sad: Math.max(0, 60 - serotonin) * 0.5 + Math.max(0, 50 - dopamine) * 0.3 + cortisol * 0.2,
      angry: cortisol * 0.4 + adrenaline * 0.3 + Math.max(0, 40 - serotonin) * 0.3,
      scared: adrenaline * 0.5 + cortisol * 0.4 + Math.max(0, 50 - oxytocin) * 0.1,
      loving: oxytocin * 0.7 + endorphins * 0.2 + serotonin * 0.1,
      excited: dopamine * 0.4 + adrenaline * 0.4 + endorphins * 0.2,
      tired: Math.max(0, 50 - dopamine) * 0.4 + Math.max(0, 50 - adrenaline) * 0.3 + Math.max(0, 50 - serotonin) * 0.3,
      curious: dopamine * 0.5 + Math.max(0, 50 - cortisol) * 0.3 + serotonin * 0.2,
      confused: cortisol * 0.4 + Math.max(0, 50 - serotonin) * 0.3 + Math.max(0, 50 - dopamine) * 0.3,
      neutral: Math.max(0, 50 - Math.abs(serotonin - 60)) + Math.max(0, 30 - cortisol),
    };
  }

  private calculateIntensity(score: number): EmotionIntensity {
    if (score >= EMOTION_INTENSITY_THRESHOLDS.overwhelming * 100) return 'overwhelming';
    if (score >= EMOTION_INTENSITY_THRESHOLDS.strong * 100) return 'strong';
    if (score >= EMOTION_INTENSITY_THRESHOLDS.moderate * 100) return 'moderate';
    return 'subtle';
  }

  private calculateValence(hormones: HormoneLevels): number {
    const { dopamine, serotonin, oxytocin, cortisol, endorphins } = hormones;
    const positive = (dopamine + serotonin + oxytocin + endorphins) / 4;
    const negative = cortisol;
    return clamp((positive - negative) / 50, -1, 1);
  }

  private calculateArousal(hormones: HormoneLevels): number {
    const { dopamine, adrenaline, cortisol } = hormones;
    const arousal = (dopamine * 0.3 + adrenaline * 0.5 + cortisol * 0.2) / 100;
    return clamp(arousal, 0, 1);
  }

  private updateHistory(emotion: EmotionType): void {
    this.emotionHistory.push({ emotion, timestamp: new Date() });
    if (this.emotionHistory.length > 100) {
      this.emotionHistory.shift();
    }
  }

  public getCurrentEmotion(): EmotionState | null {
    return this.currentEmotion;
  }

  public getExpression(emotion: EmotionType): string {
    return EMOTION_TO_EXPRESSION[emotion];
  }

  public getEmotionConfig(emotion: EmotionType) {
    return EMOTION_CONFIGS[emotion];
  }

  public isPositiveEmotion(emotion: EmotionType): boolean {
    return POSITIVE_EMOTIONS.includes(emotion);
  }

  public isNegativeEmotion(emotion: EmotionType): boolean {
    return NEGATIVE_EMOTIONS.includes(emotion);
  }

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

  public getEmoji(emotion: EmotionType): string {
    return EMOTION_CONFIGS[emotion].emoji;
  }

  public getColor(emotion: EmotionType): string {
    return EMOTION_CONFIGS[emotion].color;
  }

  public calculateStability(): number {
    if (this.emotionHistory.length < 5) return 1;

    const recent = this.emotionHistory.slice(-10);
    const uniqueEmotions = new Set(recent.map(e => e.emotion));
    
    return 1 - (uniqueEmotions.size - 1) / 9;
  }

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

  public resetHistory(): void {
    this.emotionHistory = [];
    this.currentEmotion = null;
  }
}

export const emotionService = EmotionService.getInstance();
export default emotionService;
