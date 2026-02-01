// src/services/database/queries/conversations.ts
// Queries CRUD pour les conversations et messages

import { databaseService } from '../DatabaseService';
import { generateUUID } from '../../../utils';
import { Conversation, ConversationSummary, Message, MessageRole, MessageContentType, LoadMessagesOptions } from '../../../types';

interface ConversationRow {
  id: string;
  tamagochai_id: string;
  title: string | null;
  summary: string | null;
  topics: string;
  mood: string;
  message_count: number;
  xp_earned: number;
  memories_created: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  ended_at: string | null;
  end_reason: string | null;
}

interface MessageRow {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  content_type: string;
  tokens_used: number | null;
  generation_time: number | null;
  emotion_at_time: string | null;
  hormone_snapshot: string | null;
  is_edited: number;
  edited_at: string | null;
  is_regenerated: number;
  regeneration_count: number;
  created_at: string;
}

function rowToConversation(row: ConversationRow): Conversation {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary ?? undefined,
    topics: JSON.parse(row.topics || '[]'),
    mood: row.mood,
    messageCount: row.message_count,
    xpEarned: row.xp_earned,
    memoriesCreated: row.memories_created,
    isActive: row.is_active === 1,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    endedAt: row.ended_at ? new Date(row.ended_at) : undefined,
    endReason: row.end_reason as any,
  };
}

function rowToMessage(row: MessageRow): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    role: row.role as MessageRole,
    content: row.content,
    contentType: row.content_type as MessageContentType,
    timestamp: new Date(row.created_at),
    tokensUsed: row.tokens_used ?? undefined,
    generationTime: row.generation_time ?? undefined,
    emotionAtTime: row.emotion_at_time ?? undefined,
    hormoneSnapshot: row.hormone_snapshot ? JSON.parse(row.hormone_snapshot) : undefined,
    isEdited: row.is_edited === 1,
    editedAt: row.edited_at ? new Date(row.edited_at) : undefined,
    isRegenerated: row.is_regenerated === 1,
    regenerationCount: row.regeneration_count,
  };
}

// CONVERSATIONS

export async function createConversation(tamagochaiId: string, title?: string): Promise<string> {
  const id = generateUUID();
  await databaseService.run(`INSERT INTO conversations (id, tamagochai_id, title) VALUES (?, ?, ?)`, [id, tamagochaiId, title || null]);
  return id;
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  const row = await databaseService.queryOne<ConversationRow>('SELECT * FROM conversations WHERE id = ?', [id]);
  if (!row) return null;
  return rowToConversation(row);
}

export async function getActiveConversation(tamagochaiId: string): Promise<Conversation | null> {
  const row = await databaseService.queryOne<ConversationRow>(
    `SELECT * FROM conversations WHERE tamagochai_id = ? AND is_active = 1 ORDER BY updated_at DESC LIMIT 1`, [tamagochaiId]
  );
  if (!row) return null;
  return rowToConversation(row);
}

export async function getRecentConversations(tamagochaiId: string, limit: number = 20): Promise<ConversationSummary[]> {
  const rows = await databaseService.query<ConversationRow & { preview: string }>(
    `SELECT c.*, (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as preview
     FROM conversations c WHERE c.tamagochai_id = ? ORDER BY c.updated_at DESC LIMIT ?`, [tamagochaiId, limit]
  );
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    preview: row.preview || '',
    messageCount: row.message_count,
    updatedAt: new Date(row.updated_at),
    mood: row.mood,
  }));
}

export async function updateConversation(id: string, updates: Partial<{ title: string; summary: string; topics: string[]; mood: string }>): Promise<void> {
  const setClauses: string[] = ["updated_at = datetime('now')"];
  const params: any[] = [];
  if (updates.title !== undefined) { setClauses.push('title = ?'); params.push(updates.title); }
  if (updates.summary !== undefined) { setClauses.push('summary = ?'); params.push(updates.summary); }
  if (updates.topics !== undefined) { setClauses.push('topics = ?'); params.push(JSON.stringify(updates.topics)); }
  if (updates.mood !== undefined) { setClauses.push('mood = ?'); params.push(updates.mood); }
  params.push(id);
  await databaseService.run(`UPDATE conversations SET ${setClauses.join(', ')} WHERE id = ?`, params);
}

export async function incrementMessageCount(id: string): Promise<void> {
  await databaseService.run(`UPDATE conversations SET message_count = message_count + 1, updated_at = datetime('now') WHERE id = ?`, [id]);
}

export async function addXPEarned(id: string, xp: number): Promise<void> {
  await databaseService.run(`UPDATE conversations SET xp_earned = xp_earned + ? WHERE id = ?`, [xp, id]);
}

export async function incrementMemoriesCreated(id: string): Promise<void> {
  await databaseService.run(`UPDATE conversations SET memories_created = memories_created + 1 WHERE id = ?`, [id]);
}

export async function endConversation(id: string, reason: 'user_left' | 'timeout' | 'natural_end'): Promise<void> {
  await databaseService.run(`UPDATE conversations SET is_active = 0, ended_at = datetime('now'), end_reason = ? WHERE id = ?`, [reason, id]);
}

export async function deleteConversation(id: string): Promise<void> {
  await databaseService.run('DELETE FROM conversations WHERE id = ?', [id]);
}

// MESSAGES

export async function createMessage(
  conversationId: string,
  role: MessageRole,
  content: string,
  options?: { contentType?: MessageContentType; tokensUsed?: number; generationTime?: number; emotionAtTime?: string; hormoneSnapshot?: Record<string, number> }
): Promise<string> {
  const id = generateUUID();
  await databaseService.run(
    `INSERT INTO messages (id, conversation_id, role, content, content_type, tokens_used, generation_time, emotion_at_time, hormone_snapshot)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, conversationId, role, content, options?.contentType || 'text', options?.tokensUsed || null,
     options?.generationTime || null, options?.emotionAtTime || null, options?.hormoneSnapshot ? JSON.stringify(options.hormoneSnapshot) : null]
  );
  await incrementMessageCount(conversationId);
  return id;
}

export async function getMessageById(id: string): Promise<Message | null> {
  const row = await databaseService.queryOne<MessageRow>('SELECT * FROM messages WHERE id = ?', [id]);
  if (!row) return null;
  return rowToMessage(row);
}

export async function getMessages(options: LoadMessagesOptions): Promise<Message[]> {
  let query = 'SELECT * FROM messages WHERE conversation_id = ?';
  const params: any[] = [options.conversationId];
  if (options.beforeId) { query += ' AND created_at < (SELECT created_at FROM messages WHERE id = ?)'; params.push(options.beforeId); }
  if (options.afterId) { query += ' AND created_at > (SELECT created_at FROM messages WHERE id = ?)'; params.push(options.afterId); }
  query += ' ORDER BY created_at ASC';
  if (options.limit) { query += ' LIMIT ?'; params.push(options.limit); }
  const rows = await databaseService.query<MessageRow>(query, params);
  return rows.map(rowToMessage);
}

export async function getRecentMessages(conversationId: string, limit: number = 20): Promise<Message[]> {
  const rows = await databaseService.query<MessageRow>(
    `SELECT * FROM (SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT ?) ORDER BY created_at ASC`,
    [conversationId, limit]
  );
  return rows.map(rowToMessage);
}

export async function getLastMessage(conversationId: string): Promise<Message | null> {
  const row = await databaseService.queryOne<MessageRow>(`SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1`, [conversationId]);
  if (!row) return null;
  return rowToMessage(row);
}

export async function updateMessage(id: string, content: string): Promise<void> {
  await databaseService.run(`UPDATE messages SET content = ?, is_edited = 1, edited_at = datetime('now') WHERE id = ?`, [content, id]);
}

export async function markAsRegenerated(id: string): Promise<void> {
  await databaseService.run(`UPDATE messages SET is_regenerated = 1, regeneration_count = regeneration_count + 1 WHERE id = ?`, [id]);
}

export async function deleteMessage(id: string): Promise<void> {
  await databaseService.run('DELETE FROM messages WHERE id = ?', [id]);
}

export async function countMessages(conversationId: string): Promise<number> {
  const result = await databaseService.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM messages WHERE conversation_id = ?', [conversationId]);
  return result?.count ?? 0;
}

export async function getAllMessages(tamagochaiId: string): Promise<Message[]> {
  const rows = await databaseService.query<MessageRow>(
    `SELECT m.* FROM messages m INNER JOIN conversations c ON m.conversation_id = c.id WHERE c.tamagochai_id = ? ORDER BY m.created_at ASC`,
    [tamagochaiId]
  );
  return rows.map(rowToMessage);
}
