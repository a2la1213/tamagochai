// src/components/stats/EmotionIndicator.tsx
// Composant indicateur d'émotion

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { EmotionType, EmotionState, EmotionIntensity } from '../../types';
import { EMOTION_CONFIGS } from '../../constants';
import { formatEmotionName } from '../../utils';

interface EmotionIndicatorProps {
  emotion: EmotionType;
  intensity?: EmotionIntensity;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  showIntensity?: boolean;
}

interface EmotionDisplayProps {
  state: EmotionState;
  showSecondary?: boolean;
  compact?: boolean;
}

const SIZES = {
  small: { emoji: 20, label: 10, container: 36 },
  medium: { emoji: 32, label: 12, container: 56 },
  large: { emoji: 48, label: 14, container: 80 },
};

/**
 * Indicateur d'émotion simple
 */
export function EmotionIndicator({
  emotion,
  intensity = 'moderate',
  size = 'medium',
  showLabel = true,
  showIntensity = false,
}: EmotionIndicatorProps) {
  const config = EMOTION_CONFIGS[emotion];
  const sizeConfig = SIZES[size];

  // Opacité selon l'intensité
  const intensityOpacity = useMemo(() => {
    const opacities: Record<EmotionIntensity, number> = {
      subtle: 0.5,
      moderate: 0.75,
      strong: 0.9,
      overwhelming: 1,
    };
    return opacities[intensity];
  }, [intensity]);

  // Label d'intensité
  const intensityLabel = useMemo(() => {
    const labels: Record<EmotionIntensity, string> = {
      subtle: 'légèrement',
      moderate: '',
      strong: 'très',
      overwhelming: 'extrêmement',
    };
    return labels[intensity];
  }, [intensity]);

  return (
    <View style={styles.container}>
      {/* Cercle avec emoji */}
      <View
        style={[
          styles.emojiContainer,
          {
            width: sizeConfig.container,
            height: sizeConfig.container,
            borderRadius: sizeConfig.container / 2,
            backgroundColor: `${config.color}20`,
            opacity: intensityOpacity,
          },
        ]}
      >
        <Text style={{ fontSize: sizeConfig.emoji }}>{config.emoji}</Text>
      </View>

      {/* Label */}
      {showLabel && (
        <View style={styles.labelContainer}>
          {showIntensity && intensityLabel ? (
            <Text style={[styles.label, { fontSize: sizeConfig.label }]}>
              {intensityLabel} {config.displayName.toLowerCase()}
            </Text>
          ) : (
            <Text
              style={[
                styles.label,
                { fontSize: sizeConfig.label, color: config.color },
              ]}
            >
              {config.displayName}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

/**
 * Affichage complet de l'état émotionnel
 */
export function EmotionDisplay({
  state,
  showSecondary = true,
  compact = false,
}: EmotionDisplayProps) {
  const primaryConfig = EMOTION_CONFIGS[state.primary];
  const secondaryConfig = state.secondary
    ? EMOTION_CONFIGS[state.secondary]
    : null;

  // Barre de valence (-1 à +1)
  const valencePercent = ((state.valence + 1) / 2) * 100;

  // Barre d'arousal (0 à 1)
  const arousalPercent = state.arousal * 100;

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactEmoji}>{primaryConfig.emoji}</Text>
        <Text style={[styles.compactLabel, { color: primaryConfig.color }]}>
          {primaryConfig.displayName}
        </Text>
        {state.secondary && secondaryConfig && (
          <Text style={styles.compactSecondary}>
            + {secondaryConfig.emoji}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.displayContainer}>
      {/* Émotion principale */}
      <View style={styles.primaryRow}>
        <View
          style={[
            styles.primaryEmoji,
            { backgroundColor: `${primaryConfig.color}20` },
          ]}
        >
          <Text style={styles.primaryEmojiText}>{primaryConfig.emoji}</Text>
        </View>
        <View style={styles.primaryInfo}>
          <Text style={[styles.primaryName, { color: primaryConfig.color }]}>
            {primaryConfig.displayName}
          </Text>
          <Text style={styles.primaryDescription}>
            {primaryConfig.description}
          </Text>
        </View>
      </View>

      {/* Émotion secondaire */}
      {showSecondary && state.secondary && secondaryConfig && (
        <View style={styles.secondaryRow}>
          <Text style={styles.secondaryLabel}>Nuance :</Text>
          <Text style={styles.secondaryEmoji}>{secondaryConfig.emoji}</Text>
          <Text style={[styles.secondaryName, { color: secondaryConfig.color }]}>
            {secondaryConfig.displayName}
          </Text>
        </View>
      )}

      {/* Barres valence/arousal */}
      <View style={styles.barsContainer}>
        {/* Valence */}
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>Valence</Text>
          <View style={styles.barTrack}>
            <View style={styles.barCenter} />
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.abs(state.valence) * 50}%`,
                  left: state.valence >= 0 ? '50%' : `${50 - Math.abs(state.valence) * 50}%`,
                  backgroundColor: state.valence >= 0 ? '#10B981' : '#EF4444',
                },
              ]}
            />
          </View>
          <Text style={styles.barValue}>
            {state.valence >= 0 ? '+' : ''}{state.valence.toFixed(2)}
          </Text>
        </View>

        {/* Arousal */}
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>Arousal</Text>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFillSimple,
                {
                  width: `${arousalPercent}%`,
                  backgroundColor: '#F59E0B',
                },
              ]}
            />
          </View>
          <Text style={styles.barValue}>{state.arousal.toFixed(2)}</Text>
        </View>
      </View>

      {/* Intensité */}
      <View style={styles.intensityRow}>
        <Text style={styles.intensityLabel}>Intensité :</Text>
        <View style={styles.intensityDots}>
          {['subtle', 'moderate', 'strong', 'overwhelming'].map((level, index) => {
            const isActive =
              ['subtle', 'moderate', 'strong', 'overwhelming'].indexOf(
                state.intensity
              ) >= index;
            return (
              <View
                key={level}
                style={[
                  styles.intensityDot,
                  {
                    backgroundColor: isActive ? primaryConfig.color : '#E5E7EB',
                  },
                ]}
              />
            );
          })}
        </View>
        <Text style={styles.intensityText}>{state.intensity}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  emojiContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    marginTop: 6,
  },
  label: {
    fontWeight: '500',
    textAlign: 'center',
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  compactEmoji: {
    fontSize: 18,
  },
  compactLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  compactSecondary: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  // Display styles
  displayContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryEmoji: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  primaryEmojiText: {
    fontSize: 32,
  },
  primaryInfo: {
    flex: 1,
  },
  primaryName: {
    fontSize: 20,
    fontWeight: '700',
  },
  primaryDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  secondaryLabel: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  secondaryEmoji: {
    fontSize: 18,
  },
  secondaryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  barsContainer: {
    marginTop: 8,
    gap: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  barLabel: {
    width: 60,
    fontSize: 12,
    color: '#6B7280',
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  barCenter: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#D1D5DB',
  },
  barFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 4,
  },
  barFillSimple: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
  },
  barValue: {
    width: 40,
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  intensityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 10,
  },
  intensityLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  intensityDots: {
    flexDirection: 'row',
    gap: 4,
  },
  intensityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  intensityText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 'auto',
  },
});

export default EmotionIndicator;
