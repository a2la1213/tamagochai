// app/(tabs)/settings.tsx
// Écran des paramètres

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTamagochaiStore, useConversationStore } from '../../src/stores';
import { databaseService } from '../../src/services/database';
import { APP_CONFIG } from '../../src/constants';

export default function SettingsScreen() {
  const tamagochai = useTamagochaiStore(state => state.tamagochai);
  const reset = useTamagochaiStore(state => state.reset);
  const conversationReset = useConversationStore(state => state.reset);

  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Réinitialiser le TamagochAI
  const handleReset = () => {
    Alert.alert(
      'Réinitialiser',
      `Es-tu sûr de vouloir supprimer ${tamagochai?.name || 'ton TamagochAI'} ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.resetDatabase();
              conversationReset();
              reset();
              router.replace('/onboarding');
            } catch (error) {
              console.error('[Settings] Reset error:', error);
              Alert.alert('Erreur', 'Impossible de réinitialiser.');
            }
          },
        },
      ]
    );
  };

  // Ouvrir un lien externe
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('[Settings] Link error:', err)
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Réglages</Text>

        {/* Section TamagochAI */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mon TamagochAI</Text>
          <View style={styles.card}>
            <SettingRow
              icon="person-outline"
              label="Nom"
              value={tamagochai?.name || '-'}
              onPress={() => {}}
            />
            <SettingRow
              icon="color-palette-outline"
              label="Apparence"
              value="Modifier"
              onPress={() => {}}
              showChevron
            />
          </View>
        </View>

        {/* Section Préférences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>
          <View style={styles.card}>
            <SettingToggle
              icon="notifications-outline"
              label="Notifications"
              value={notifications}
              onToggle={setNotifications}
            />
            <SettingToggle
              icon="phone-portrait-outline"
              label="Vibrations"
              value={haptics}
              onToggle={setHaptics}
            />
            <SettingToggle
              icon="moon-outline"
              label="Mode sombre"
              value={darkMode}
              onToggle={setDarkMode}
            />
          </View>
        </View>

        {/* Section À propos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.card}>
            <SettingRow
              icon="information-circle-outline"
              label="Version"
              value={APP_CONFIG.version}
            />
            <SettingRow
              icon="code-slash-outline"
              label="Mode"
              value={APP_CONFIG.developmentMode}
            />
            <SettingRow
              icon="document-text-outline"
              label="Politique de confidentialité"
              onPress={() => openLink('https://example.com/privacy')}
              showChevron
            />
            <SettingRow
              icon="help-circle-outline"
              label="Aide & Support"
              onPress={() => openLink('https://example.com/support')}
              showChevron
            />
          </View>
        </View>

        {/* Section Données */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Données</Text>
          <View style={styles.card}>
            <SettingRow
              icon="download-outline"
              label="Exporter mes données"
              onPress={() => Alert.alert('Export', 'Fonctionnalité à venir !')}
              showChevron
            />
            <SettingRow
              icon="trash-outline"
              label="Réinitialiser"
              onPress={handleReset}
              showChevron
              danger
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            TamagochAI v{APP_CONFIG.version}
          </Text>
          <Text style={styles.footerSubtext}>
            Fait avec 💙 par toi
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Ligne de paramètre cliquable
 */
function SettingRow({
  icon,
  label,
  value,
  onPress,
  showChevron,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingRow,
        pressed && onPress && styles.settingRowPressed,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingRowLeft}>
        <Ionicons
          name={icon}
          size={20}
          color={danger ? '#EF4444' : '#6B7280'}
        />
        <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>
          {label}
        </Text>
      </View>
      <View style={styles.settingRowRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {showChevron && (
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        )}
      </View>
    </Pressable>
  );
}

/**
 * Ligne de paramètre avec toggle
 */
function SettingToggle({
  icon,
  label,
  value,
  onToggle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingRowLeft}>
        <Ionicons name={icon} size={20} color="#6B7280" />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
        thumbColor={value ? '#3B82F6' : '#F3F4F6'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingRowPressed: {
    backgroundColor: '#F9FAFB',
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  settingLabel: {
    fontSize: 15,
    color: '#1F2937',
  },
  settingLabelDanger: {
    color: '#EF4444',
  },
  settingValue: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 4,
  },
});
