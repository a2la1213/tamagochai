// src/components/chat/ChatBubble.tsx
// Composant bulle de message pour le chat

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Message, MessageRole } from '../../types';
import { formatTime, formatRelativeTime } from '../../utils';

interface ChatBubbleProps {
  message: Message;
  showTimestamp?: boolean;
  showEmotion?: boolean;
  onLongPress?: (message: Message) => void;
}

/**
 * Composant bulle de message
 */
export function ChatBubble({
  message,
  showTimestamp = true,
  showEmotion = false,
  onLongPress,
}: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  // Couleurs selon le rôle
  const colors = useMemo(() => {
    if (isUser) {
      return {
        background: '#3B82F6',
        text: '#FFFFFF',
        timestamp: '#FFFFFF99',
      };
    }
    if (isSystem) {
      return {
        background: '#F3F4F6',
        text: '#6B7280',
        timestamp: '#9CA3AF',
      };
    }
    // Assistant
    return {
      background: '#F3F4F6',
      text: '#1F2937',
      timestamp: '#9CA3AF',
    };
  }, [isUser, isSystem]);

  // Formater le timestamp
  const timestamp = useMemo(() => {
    if (!showTimestamp) return null;
    return formatTime(message.timestamp);
  }, [message.timestamp, showTimestamp]);

  // Emoji d'émotion
  const emotionEmoji = useMemo(() => {
    if (!showEmotion || !message.emotionAtTime) return null;
    
    const emojiMap: Record<string, string> = {
      neutral: '😐',
      happy: '😊',
      sad: '😢',
      angry: '😠',
      scared: '😨',
      loving: '🥰',
      excited: '🤩',
      tired: '😴',
      curious: '🤔',
      confused: '😕',
    };
    
    return emojiMap[message.emotionAtTime] ?? null;
  }, [showEmotion, message.emotionAtTime]);

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(message);
    }
  };

  // Message système (centré, style différent)
  if (isSystem) {
    return (
      <View style={styles.systemContainer}>
        <Text style={[styles.systemText, { color: colors.text }]}>
          {message.content}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <Pressable
        onLongPress={handleLongPress}
        style={({ pressed }) => [
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
          { backgroundColor: colors.background },
          pressed && styles.pressed,
        ]}
      >
        {/* Contenu du message */}
        <Text style={[styles.messageText, { color: colors.text }]}>
          {message.content}
        </Text>

        {/* Footer: timestamp + émotion */}
        <View style={styles.footer}>
          {emotionEmoji && (
            <Text style={styles.emotionEmoji}>{emotionEmoji}</Text>
          )}
          {timestamp && (
            <Text style={[styles.timestamp, { color: colors.timestamp }]}>
              {timestamp}
            </Text>
          )}
          {message.isEdited && (
            <Text style={[styles.editedLabel, { color: colors.timestamp }]}>
              (modifié)
            </Text>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 12,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
  },
  pressed: {
    opacity: 0.8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  timestamp: {
    fontSize: 11,
  },
  editedLabel: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  emotionEmoji: {
    fontSize: 12,
  },
  systemContainer: {
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 20,
  },
  systemText: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ChatBubble;
