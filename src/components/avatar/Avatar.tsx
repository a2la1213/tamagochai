// src/components/avatar/Avatar.tsx
// Composant d'affichage de l'avatar du TamagochAI

import React, { useMemo } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { AvatarConfig, AvatarExpression, AvatarType } from '../../types';
import { AVATAR_COLOR_CONFIG } from '../../constants';

interface AvatarProps {
  config: AvatarConfig;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  expression?: AvatarExpression;
  animated?: boolean;
}

const SIZES = {
  small: 48,
  medium: 80,
  large: 120,
  xlarge: 180,
};

/**
 * Composant Avatar du TamagochAI
 */
export function Avatar({
  config,
  size = 'medium',
  expression,
  animated = true,
}: AvatarProps) {
  const pixelSize = SIZES[size];
  const currentExpression = expression ?? config.currentExpression;
  const color = AVATAR_COLOR_CONFIG[config.color]?.hex ?? '#3B82F6';

  // Emojis selon le type d'avatar
  const avatarEmoji = useMemo(() => {
    const emojis: Record<AvatarType, Record<AvatarExpression, string>> = {
      robot: {
        neutral: '🤖',
        happy: '🤖',
        sad: '🤖',
        angry: '🤖',
        scared: '🤖',
        loving: '🤖',
      },
      humanoid: {
        neutral: '😐',
        happy: '😊',
        sad: '😢',
        angry: '😠',
        scared: '😨',
        loving: '🥰',
      },
      creature: {
        neutral: '🐲',
        happy: '🐲',
        sad: '🐲',
        angry: '🐲',
        scared: '🐲',
        loving: '🐲',
      },
      spirit: {
        neutral: '👻',
        happy: '👻',
        sad: '👻',
        angry: '👻',
        scared: '👻',
        loving: '👻',
      },
      animal: {
        neutral: '🐱',
        happy: '😺',
        sad: '😿',
        angry: '😾',
        scared: '🙀',
        loving: '😻',
      },
      abstract: {
        neutral: '◆',
        happy: '✦',
        sad: '◇',
        angry: '✴',
        scared: '❖',
        loving: '❤',
      },
    };

    return emojis[config.type]?.[currentExpression] ?? '🤖';
  }, [config.type, currentExpression]);

  // Yeux selon l'expression
  const eyes = useMemo(() => {
    const eyeStyles: Record<AvatarExpression, { left: string; right: string }> = {
      neutral: { left: '●', right: '●' },
      happy: { left: '◠', right: '◠' },
      sad: { left: '◡', right: '◡' },
      angry: { left: '▼', right: '▼' },
      scared: { left: '◎', right: '◎' },
      loving: { left: '♥', right: '♥' },
    };
    return eyeStyles[currentExpression];
  }, [currentExpression]);

  // Bouche selon l'expression
  const mouth = useMemo(() => {
    const mouthStyles: Record<AvatarExpression, string> = {
      neutral: '―',
      happy: '◡',
      sad: '◠',
      angry: '︵',
      scared: 'O',
      loving: '♡',
    };
    return mouthStyles[currentExpression];
  }, [currentExpression]);

  const fontSize = pixelSize * 0.3;
  const eyeSize = pixelSize * 0.15;
  const mouthSize = pixelSize * 0.2;

  return (
    <View
      style={[
        styles.container,
        {
          width: pixelSize,
          height: pixelSize,
          borderRadius: pixelSize / 2,
          backgroundColor: color,
        },
      ]}
    >
      {/* Fond avec dégradé simulé */}
      <View style={[styles.innerCircle, { backgroundColor: `${color}dd` }]}>
        {/* Yeux */}
        <View style={styles.eyesContainer}>
          <View style={[styles.eye, { width: eyeSize, height: eyeSize }]}>
            <Animated.Text style={[styles.eyeText, { fontSize: eyeSize }]}>
              {eyes.left}
            </Animated.Text>
          </View>
          <View style={[styles.eye, { width: eyeSize, height: eyeSize }]}>
            <Animated.Text style={[styles.eyeText, { fontSize: eyeSize }]}>
              {eyes.right}
            </Animated.Text>
          </View>
        </View>

        {/* Bouche */}
        <View style={styles.mouthContainer}>
          <Animated.Text style={[styles.mouthText, { fontSize: mouthSize }]}>
            {mouth}
          </Animated.Text>
        </View>
      </View>

      {/* Indicateur d'expression (emoji en badge) */}
      {size !== 'small' && (
        <View style={styles.expressionBadge}>
          <Animated.Text style={[styles.expressionEmoji, { fontSize: pixelSize * 0.2 }]}>
            {avatarEmoji}
          </Animated.Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  innerCircle: {
    width: '85%',
    height: '85%',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 5,
  },
  eye: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  mouthContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mouthText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  expressionBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  expressionEmoji: {
    textAlign: 'center',
  },
});

export default Avatar;
