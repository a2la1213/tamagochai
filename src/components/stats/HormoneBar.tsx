// src/components/stats/HormoneBar.tsx
// Composant barre d'hormone avec indicateur de niveau

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HormoneType } from '../../types';
import { HORMONE_CONFIGS } from '../../constants';
import { formatHormoneName } from '../../utils';

interface HormoneBarProps {
  hormone: HormoneType;
  level: number;
  showLabel?: boolean;
  showValue?: boolean;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

const HORMONE_COLORS: Record<HormoneType, string> = {
  dopamine: '#F59E0B',
  serotonin: '#10B981',
  oxytocin: '#EC4899',
  cortisol: '#EF4444',
  adrenaline: '#F97316',
  endorphins: '#8B5CF6',
};

const SIZES = {
  small: { height: 6, fontSize: 10 },
  medium: { height: 10, fontSize: 12 },
  large: { height: 14, fontSize: 14 },
};

export function HormoneBar({
  hormone,
  level,
  showLabel = true,
  showValue = true,
  size = 'medium',
  animated = true,
}: HormoneBarProps) {
  const config = HORMONE_CONFIGS[hormone];
  const color = HORMONE_COLORS[hormone];
  const sizeConfig = SIZES[size];

  const clampedLevel = Math.max(0, Math.min(100, level));
  const fillWidthPercent = clampedLevel;
  const baselinePercent = config.baseline;

  const levelState = useMemo(() => {
    const diff = clampedLevel - config.baseline;
    if (Math.abs(diff) <= 10) return 'normal';
    if (diff > 0) return 'high';
    return 'low';
  }, [clampedLevel, config.baseline]);

  const backgroundColor = useMemo(() => {
    switch (levelState) {
      case 'high':
        return `${color}20`;
      case 'low':
        return '#FEE2E220';
      default:
        return '#F3F4F6';
    }
  }, [levelState, color]);

  return (
    <View style={styles.container}>
      {(showLabel || showValue) && (
        <View style={styles.header}>
          {showLabel && (
            <Text style={[styles.label, { fontSize: sizeConfig.fontSize }]}>
              {formatHormoneName(hormone)}
            </Text>
          )}
          {showValue && (
            <Text style={[styles.value, { fontSize: sizeConfig.fontSize, color }]}>
              {Math.round(clampedLevel)}
            </Text>
          )}
        </View>
      )}

      <View
        style={[
          styles.track,
          {
            height: sizeConfig.height,
            backgroundColor,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${fillWidthPercent}%` as any,
              backgroundColor: color,
            },
          ]}
        />

        <View
          style={[
            styles.baselineIndicator,
            {
              left: `${baselinePercent}%` as any,
              height: sizeConfig.height + 4,
            },
          ]}
        />
      </View>

      {size === 'large' && (
        <Text style={styles.description}>
          {config.description}
        </Text>
      )}
    </View>
  );
}

export function HormonePanel({
  levels,
  size = 'medium',
}: {
  levels: Record<HormoneType, number>;
  size?: 'small' | 'medium' | 'large';
}) {
  const hormones: HormoneType[] = [
    'dopamine',
    'serotonin',
    'oxytocin',
    'cortisol',
    'adrenaline',
    'endorphins',
  ];

  return (
    <View style={styles.panel}>
      {hormones.map((hormone) => (
        <HormoneBar
          key={hormone}
          hormone={hormone}
          level={levels[hormone] ?? 50}
          size={size}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    color: '#374151',
    fontWeight: '500',
  },
  value: {
    fontWeight: '600',
  },
  track: {
    borderRadius: 100,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 100,
  },
  baselineIndicator: {
    position: 'absolute',
    top: -2,
    width: 2,
    backgroundColor: '#6B7280',
    borderRadius: 1,
  },
  description: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  panel: {
    gap: 8,
  },
});

export default HormoneBar;
