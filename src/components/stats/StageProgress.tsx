// src/components/stats/StageProgress.tsx
// Composant affichage de la progression d'évolution

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EvolutionStage, EvolutionProgress } from '../../types';
import { EVOLUTION_STAGES, STAGE_ORDER } from '../../constants';
import { formatXP, formatStageName } from '../../utils';

interface StageProgressProps {
  progress: EvolutionProgress;
  showDetails?: boolean;
  compact?: boolean;
}

const STAGE_COLORS: Record<EvolutionStage, string> = {
  emergence: '#10B981',
  learning: '#3B82F6',
  individuation: '#8B5CF6',
  wisdom: '#F59E0B',
  transcendence: '#EC4899',
};

const STAGE_EMOJIS: Record<EvolutionStage, string> = {
  emergence: '🌱',
  learning: '📚',
  individuation: '🦋',
  wisdom: '🦉',
  transcendence: '✨',
};

export function StageProgress({
  progress,
  showDetails = true,
  compact = false,
}: StageProgressProps) {
  const { currentStage, percentage, xpInCurrentStage, xpForNextStage, nextStage } = progress;

  const color = STAGE_COLORS[currentStage];
  const emoji = STAGE_EMOJIS[currentStage];
  const stageName = formatStageName(currentStage);

  const formattedCurrentXP = formatXP(xpInCurrentStage);
  const formattedTargetXP = xpForNextStage ? formatXP(xpForNextStage) : '∞';

  const isFinalStage = currentStage === 'transcendence';

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactEmoji}>{emoji}</Text>
        <View style={styles.compactInfo}>
          <Text style={[styles.compactStageName, { color }]}>{stageName}</Text>
          <View style={styles.compactBarContainer}>
            <View style={styles.compactBarTrack}>
              <View
                style={[
                  styles.compactBarFill,
                  { width: `${percentage}%` as any, backgroundColor: color },
                ]}
              />
            </View>
            <Text style={styles.compactPercent}>{Math.round(percentage)}%</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.headerText}>
          <Text style={[styles.stageName, { color }]}>{stageName}</Text>
          <Text style={styles.stageDescription}>
            {EVOLUTION_STAGES[currentStage].description}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${percentage}%` as any, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={styles.percentText}>{Math.round(percentage)}%</Text>
      </View>

      {showDetails && (
        <View style={styles.xpContainer}>
          <Text style={styles.xpText}>
            {formattedCurrentXP} / {formattedTargetXP}
          </Text>
          {!isFinalStage && nextStage && (
            <Text style={styles.nextStageText}>
              Prochain : {STAGE_EMOJIS[nextStage]} {formatStageName(nextStage)}
            </Text>
          )}
          {isFinalStage && (
            <Text style={styles.finalStageText}>
              ✨ Stade ultime atteint !
            </Text>
          )}
        </View>
      )}

      {showDetails && (
        <View style={styles.timeline}>
          {STAGE_ORDER.map((stage, index) => {
            const isCompleted = STAGE_ORDER.indexOf(currentStage) > index;
            const isCurrent = stage === currentStage;
            const stageColor = STAGE_COLORS[stage];

            return (
              <View key={stage} style={styles.timelineItem}>
                <View
                  style={[
                    styles.timelineDot,
                    {
                      backgroundColor: isCompleted || isCurrent ? stageColor : '#E5E7EB',
                      borderColor: isCurrent ? stageColor : 'transparent',
                      borderWidth: isCurrent ? 2 : 0,
                    },
                  ]}
                >
                  {(isCompleted || isCurrent) && (
                    <Text style={styles.timelineEmoji}>{STAGE_EMOJIS[stage]}</Text>
                  )}
                </View>
                {index < STAGE_ORDER.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      { backgroundColor: isCompleted ? stageColor : '#E5E7EB' },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

export function StageBadge({ stage }: { stage: EvolutionStage }) {
  const color = STAGE_COLORS[stage];
  const emoji = STAGE_EMOJIS[stage];
  const name = formatStageName(stage);

  return (
    <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
      <Text style={styles.badgeEmoji}>{emoji}</Text>
      <Text style={[styles.badgeName, { color }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 40,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  stageName: {
    fontSize: 20,
    fontWeight: '700',
  },
  stageDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  percentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 45,
    textAlign: 'right',
  },
  xpContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpText: {
    fontSize: 13,
    color: '#6B7280',
  },
  nextStageText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  finalStageText: {
    fontSize: 12,
    color: '#EC4899',
    fontWeight: '500',
  },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineEmoji: {
    fontSize: 14,
  },
  timelineLine: {
    width: 24,
    height: 3,
    borderRadius: 1.5,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  compactEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  compactInfo: {
    flex: 1,
  },
  compactStageName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  compactBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  compactBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  compactPercent: {
    fontSize: 11,
    color: '#6B7280',
    width: 32,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeEmoji: {
    fontSize: 14,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StageProgress;
