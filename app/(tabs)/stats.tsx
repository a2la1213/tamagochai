// app/(tabs)/stats.tsx
// Écran des statistiques du TamagochAI

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTamagochaiStore } from '../../src/stores';
import { useHormones, useEmotion, useEvolution } from '../../src/hooks';
import {
  Avatar,
  HormonePanel,
  StageProgress,
  EmotionDisplay,
} from '../../src/components';
import { formatDaysAlive, formatStreak, formatXP } from '../../src/utils';

export default function StatsScreen() {
  const tamagochai = useTamagochaiStore(state => state.tamagochai);

  const { levels: hormoneLevels } = useHormones();
  const { state: emotionState } = useEmotion();
  const { progress } = useEvolution();

  if (!tamagochai) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header avec Avatar */}
        <View style={styles.header}>
          <Avatar
            config={tamagochai.avatar}
            size="large"
            expression={tamagochai.avatar.currentExpression}
          />
          <Text style={styles.name}>{tamagochai.name}</Text>
          <Text style={styles.age}>
            {formatDaysAlive(tamagochai.stats.daysAlive)}
          </Text>
        </View>

        {/* Stats rapides */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>
              {formatXP(tamagochai.stats.totalXP)}
            </Text>
            <Text style={styles.quickStatLabel}>XP Total</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>
              {tamagochai.stats.totalMessages}
            </Text>
            <Text style={styles.quickStatLabel}>Messages</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>
              {formatStreak(tamagochai.stats.currentStreak)}
            </Text>
            <Text style={styles.quickStatLabel}>Streak</Text>
          </View>
        </View>

        {/* Progression d'évolution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Évolution</Text>
          {progress && <StageProgress progress={progress} showDetails={true} />}
        </View>

        {/* État émotionnel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>État émotionnel</Text>
          {emotionState && (
            <EmotionDisplay state={emotionState} showSecondary={true} />
          )}
        </View>

        {/* Hormones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hormones</Text>
          <View style={styles.card}>
            {hormoneLevels && (
              <HormonePanel levels={hormoneLevels} size="medium" />
            )}
          </View>
        </View>

        {/* Génome */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Génome (traits innés)</Text>
          <View style={styles.card}>
            <GenomeTrait label="Social" value={tamagochai.genome.social} />
            <GenomeTrait label="Cognitif" value={tamagochai.genome.cognitive} />
            <GenomeTrait label="Émotionnel" value={tamagochai.genome.emotional} />
            <GenomeTrait label="Énergie" value={tamagochai.genome.energy} />
            <GenomeTrait label="Créativité" value={tamagochai.genome.creativity} />
          </View>
        </View>

        {/* Souvenirs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mémoire</Text>
          <View style={styles.card}>
            <View style={styles.memoryRow}>
              <Text style={styles.memoryLabel}>Souvenirs</Text>
              <Text style={styles.memoryValue}>
                {tamagochai.stats.memoriesCount}
              </Text>
            </View>
            <View style={styles.memoryRow}>
              <Text style={styles.memoryLabel}>Souvenirs flash ⚡</Text>
              <Text style={styles.memoryValue}>
                {tamagochai.stats.flashMemoriesCount}
              </Text>
            </View>
            <View style={styles.memoryRow}>
              <Text style={styles.memoryLabel}>Conversations</Text>
              <Text style={styles.memoryValue}>
                {tamagochai.stats.totalConversations}
              </Text>
            </View>
          </View>
        </View>

        {/* Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Composant trait de génome
 */
function GenomeTrait({ label, value }: { label: string; value: number }) {
  const getTraitColor = (val: number) => {
    if (val < 35) return '#EF4444';
    if (val > 65) return '#10B981';
    return '#F59E0B';
  };

  return (
    <View style={styles.genomeRow}>
      <Text style={styles.genomeLabel}>{label}</Text>
      <View style={styles.genomeBarContainer}>
        <View style={styles.genomeBarTrack}>
          <View
            style={[
              styles.genomeBarFill,
              {
                width: `${value}%`,
                backgroundColor: getTraitColor(value),
              },
            ]}
          />
        </View>
        <Text style={[styles.genomeValue, { color: getTraitColor(value) }]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
  },
  age: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  genomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  genomeLabel: {
    width: 90,
    fontSize: 13,
    color: '#6B7280',
  },
  genomeBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  genomeBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  genomeBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  genomeValue: {
    width: 30,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  memoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  memoryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  memoryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  bottomSpacer: {
    height: 40,
  },
});
