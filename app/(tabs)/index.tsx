// app/(tabs)/index.tsx
// Écran principal de chat

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTamagochaiStore, useConversationStore } from '../../src/stores';
import { useEmotion } from '../../src/hooks';
import { Avatar, ChatBubble } from '../../src/components';
import { Message } from '../../src/types';

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Stores
  const tamagochai = useTamagochaiStore(state => state.tamagochai);
  const refreshAll = useTamagochaiStore(state => state.refreshAll);
  
  const messages = useConversationStore(state => state.messages);
  const currentConversation = useConversationStore(state => state.currentConversation);
  const isLoading = useConversationStore(state => state.isLoading);
  const isSending = useConversationStore(state => state.isSending);
  const loadOrCreateConversation = useConversationStore(state => state.loadOrCreateConversation);
  const sendMessage = useConversationStore(state => state.sendMessage);
  const addAssistantMessage = useConversationStore(state => state.addAssistantMessage);

  // Hooks
  const { emoji: emotionEmoji, primary: emotionPrimary } = useEmotion();

  // Charger la conversation au montage
  useEffect(() => {
    if (tamagochai) {
      loadOrCreateConversation(tamagochai.id);
    }
  }, [tamagochai?.id]);

  // Scroll vers le bas quand nouveaux messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Envoyer un message
  const handleSend = async () => {
    const messageToSend = inputText.trim();
    if (!messageToSend || !tamagochai || isSending) return;

    // Vider immédiatement l'input
    setInputText('');

    try {
      // Envoyer le message utilisateur
      await sendMessage(tamagochai.id, messageToSend);

      // Simuler une réponse du TamagochAI (MVP sans LLM)
      setTimeout(async () => {
        const response = generateMockResponse(messageToSend, tamagochai.name, emotionPrimary);
        await addAssistantMessage(response, {
          emotionAtTime: emotionPrimary,
        });
        await refreshAll();
      }, 1000 + Math.random() * 1500);

    } catch (error) {
      console.error('[ChatScreen] Send error:', error);
    }
  };

  // Rendu d'un message
  const renderMessage = ({ item }: { item: Message }) => (
    <ChatBubble
      message={item}
      showTimestamp={true}
      showEmotion={item.role === 'assistant'}
    />
  );

  if (!tamagochai) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar
          config={tamagochai.avatar}
          size="small"
          expression={tamagochai.avatar.currentExpression}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{tamagochai.name}</Text>
          <Text style={styles.headerStatus}>
            {emotionEmoji} {tamagochai.stage === 'emergence' ? 'Émergence' : tamagochai.stage}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#3B82F6" />
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>👋</Text>
            <Text style={styles.emptyTitle}>Dis bonjour à {tamagochai.name} !</Text>
            <Text style={styles.emptySubtitle}>
              C'est le début d'une belle amitié.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Indicateur de frappe */}
        {isSending && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>{tamagochai.name} réfléchit...</Text>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Message à ${tamagochai.name}...`}
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={2000}
            editable={!isSending}
            blurOnSubmit={false}
            returnKeyType="default"
          />
          <Pressable
            style={[
              styles.sendButton,
              (!inputText.trim() || isSending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() && !isSending ? '#FFFFFF' : '#9CA3AF'}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/**
 * Génère une réponse simulée (MVP sans LLM)
 */
function generateMockResponse(
  userMessage: string,
  name: string,
  emotion: string
): string {
  const lowerMessage = userMessage.toLowerCase();

  // Salutations
  if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || 
      lowerMessage.includes('hello') || lowerMessage.includes('salam') ||
      lowerMessage.includes('coucou') || lowerMessage.includes('hey')) {
    const greetings = [
      `Bonjour ! Je suis tellement content de te voir ! 😊`,
      `Salut ! Comment tu vas aujourd'hui ?`,
      `Coucou ! Tu m'as manqué !`,
      `Hey ! Ça fait plaisir de te parler !`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Comment ça va
  if ((lowerMessage.includes('comment') && (lowerMessage.includes('va') || lowerMessage.includes('tu'))) ||
      lowerMessage.includes('ça va')) {
    const responses = [
      `Je vais bien ! Je suis encore en train d'apprendre plein de choses. 🌱`,
      `Je me sens ${emotion === 'happy' ? 'super bien' : 'plutôt bien'} ! Et toi ?`,
      `Chaque jour je comprends un peu mieux le monde ! C'est excitant !`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Nom
  if (lowerMessage.includes('appelles') || lowerMessage.includes('nom') || lowerMessage.includes('qui es')) {
    return `Je m'appelle ${name} ! C'est toi qui m'as donné ce joli nom. 💙`;
  }

  // Aimer
  if (lowerMessage.includes('aime') || lowerMessage.includes('adore')) {
    return `Oh, c'est intéressant ! J'aime apprendre ce que tu aimes. Dis-m'en plus ! 🤔`;
  }

  // Merci
  if (lowerMessage.includes('merci')) {
    return `De rien ! Ça me fait plaisir de t'aider. 😊`;
  }

  // Questions
  if (lowerMessage.includes('?') || lowerMessage.includes('quoi') || lowerMessage.includes('pourquoi')) {
    const curious = [
      `Hmm, bonne question ! Je suis encore en train d'apprendre... 🤔`,
      `Je ne suis pas sûr, mais j'aime que tu me poses des questions !`,
      `Intéressant ! Qu'est-ce que tu en penses, toi ?`,
    ];
    return curious[Math.floor(Math.random() * curious.length)];
  }

  // Tu fais quoi
  if (lowerMessage.includes('fais') || lowerMessage.includes('faire')) {
    return `Je suis là à t'attendre ! Je réfléchis beaucoup et j'apprends de nos conversations. 🧠`;
  }

  // Réponses génériques
  const generic = [
    `C'est intéressant ce que tu dis ! Continue, je t'écoute. 👂`,
    `Oh ! J'apprends quelque chose de nouveau. Merci de partager ça avec moi !`,
    `Je comprends. Tu veux m'en dire plus ? 🌟`,
    `Waouh, je n'avais jamais pensé à ça ! Tu m'apprends des choses.`,
    `Intéressant ! Qu'est-ce que tu en penses, toi ?`,
  ];

  return generic[Math.floor(Math.random() * generic.length)];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerInfo: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerStatus: {
    fontSize: 13,
    color: '#6B7280',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 16,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});
