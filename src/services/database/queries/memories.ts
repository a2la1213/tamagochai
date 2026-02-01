// src/services/database/queries/memories.ts
// Queries CRUD pour les souvenirs (memories)

import { databaseService } from '../DatabaseService';
import { generateUUID } from '../../../utils';
import { Memory, MemoryType, MemoryImportance, MemoryQuery, MemorySearchResult, MemoryStats } from '../../../types';

interface MemoryRow {
  id: string;
  tamagochai_id: string;
  type: string;
  content: string;
  summary: string;
  importance: string;
  importance_score: number;
  conversation_id: string | null;
  message_id: string | null;
  topics: string;
  emotion_at_creation: string | null;
  emotional_valence: number;
  access_count: number;
  is_consolidated: number;
  consolidated_into: string | null;
  is_flash_memory: number;
  flash_trigger: string | null;
  created_at: string;
  last_accessed_at: string;
}

function rowToMemory(row: MemoryRow): Memory {
  return {
    id: row.id,
    type: row.type as MemoryType,
    content: row.content,
    summary: row.summary,
    importance: row.importance as MemoryImportance,
    importanceScore: row.importance_score,
    conversationId: row.conversation_id ?? undefined,
    messageId: row.message_id ?? undefined,
    topics: JSON.parse(row.topics || '[]'),
    emotionAtCreation: row.emotion_at_creation || 'neutral',
    emotionalValence: row.emotional_valence,
    accessCount: row.access_count,
    isConsolidated: row.is_consolidated === 1,
    consolidatedInto: row.consolidated_into ?? undefined,
    isFlashMemory: row.is_flash_memory === 1,
    flashTrigger: row.flash_trigger ?? undefined,
    createdAt: new Date(row.created_at),
    lastAccessedAt: new Date(row.last_accessed_at),
  };
}

export async function createMemory(
  tamagochaiId: string,
  memory: {
    type: MemoryType;
    content: string;
    summary: string;
    importance?: MemoryImportance;
    importanceScore?: number;
    conversationId?: string;
    messageId?: string;
    topics?: string[];
    emotionAtCreation?: string;
    emotionalValence?: number;
    isFlashMemory?: boolean;
    flashTrigger?: string;
  }
): Promise<string> {
  const id = generateUUID();
  await databaseService.run(
    `INSERT INTO memories (id, tamagochai_id, type, content, summary, importance, importance_score, conversation_id, message_id, topics, emotion_at_creation, emotional_valence, is_flash_memory, flash_trigger)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, tamagochaiId, memory.type, memory.content, memory.summary, memory.importance || 'medium', memory.importanceScore ?? 50,
     memory.conversationId || null, memory.messageId || null, JSON.stringify(memory.topics || []),
     memory.emotionAtCreation || 'neutral', memory.emotionalValence ?? 0, memory.isFlashMemory ? 1 : 0, memory.flashTrigger || null]
  );
  return id;
}

export async function getMemoryById(id: string): Promise<Memory | null> {
  const row = await databaseService.queryOne<MemoryRow>('SELECT * FROM memories WHERE id = ?', [id]);
  if (!row) return null;
  await incrementAccessCount(id);
  return rowToMemory(row);
}

export async function queryMemories(tamagochaiId: string, query: MemoryQuery): Promise<Memory[]> {
  let sql = 'SELECT * FROM memories WHERE tamagochai_id = ?';
  const params: any[] = [tamagochaiId];

  if (query.types && query.types.length > 0) {
    sql += ` AND type IN (${query.types.map(() => '?').join(', ')})`;
    params.push(...query.types);
  }

  if (query.minImportance) {
    const importanceOrder: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
    sql += ` AND (CASE importance WHEN 'low' THEN 1 WHEN 'medium' THEN 2 WHEN 'high' THEN 3 WHEN 'critical' THEN 4 END) >= ?`;
    params.push(importanceOrder[query.minImportance]);
  }

  if (query.topics && query.topics.length > 0) {
    for (const topic of query.topics) {
      sql += ' AND topics LIKE ?';
      params.push(`%${topic}%`);
    }
  }

  if (query.dateRange) {
    sql += ' AND created_at >= ? AND created_at <= ?';
    params.push(query.dateRange.from.toISOString(), query.dateRange.to.toISOString());
  }

  if (!query.includeConsolidated) {
    sql += ' AND is_consolidated = 0';
  }

  sql += ' ORDER BY importance_score DESC, created_at DESC';

  if (query.limit) {
    sql += ' LIMIT ?';
    params.push(query.limit);
  }

  const rows = await databaseService.query<MemoryRow>(sql, params);
  return rows.map(rowToMemory);
}

export async function searchMemories(tamagochaiId: string, searchText: string, limit: number = 10): Promise<MemorySearchResult[]> {
  const rows = await databaseService.query<MemoryRow & { rank: number }>(
    `SELECT m.*, bm25(memories_fts) as rank FROM memories m
     INNER JOIN memories_fts fts ON m.rowid = fts.rowid
     WHERE m.tamagochai_id = ? AND memories_fts MATCH ? AND m.is_consolidated = 0
     ORDER BY rank LIMIT ?`,
    [tamagochaiId, searchText, limit]
  );
  return rows.map(row => ({
    memory: rowToMemory(row),
    relevanceScore: Math.abs(row.rank),
    matchedTerms: searchText.split(' '),
  }));
}

export async function getRelevantMemories(tamagochaiId: string, context: string, limit: number = 5): Promise<Memory[]> {
  const searchResults = await searchMemories(tamagochaiId, context, limit);
  if (searchResults.length >= limit) {
    return searchResults.map(r => r.memory);
  }
  const remaining = limit - searchResults.length;
  const existingIds = searchResults.map(r => r.memory.id);
  
  let sql = `SELECT * FROM memories WHERE tamagochai_id = ? AND is_consolidated = 0`;
  const params: any[] = [tamagochaiId];
  
  if (existingIds.length > 0) {
    sql += ` AND id NOT IN (${existingIds.map(() => '?').join(', ')})`;
    params.push(...existingIds);
  }
  
  sql += ' ORDER BY importance_score DESC, access_count DESC LIMIT ?';
  params.push(remaining);

  const rows = await databaseService.query<MemoryRow>(sql, params);
  return [...searchResults.map(r => r.memory), ...rows.map(rowToMemory)];
}

export async function getFlashMemories(tamagochaiId: string): Promise<Memory[]> {
  const rows = await databaseService.query<MemoryRow>(
    `SELECT * FROM memories WHERE tamagochai_id = ? AND is_flash_memory = 1 ORDER BY created_at DESC`, [tamagochaiId]
  );
  return rows.map(rowToMemory);
}

export async function getUserFacts(tamagochaiId: string, limit: number = 20): Promise<Memory[]> {
  const rows = await databaseService.query<MemoryRow>(
    `SELECT * FROM memories WHERE tamagochai_id = ? AND type IN ('fact', 'preference', 'relationship') AND is_consolidated = 0
     ORDER BY importance_score DESC, access_count DESC LIMIT ?`, [tamagochaiId, limit]
  );
  return rows.map(rowToMemory);
}

export async function incrementAccessCount(id: string): Promise<void> {
  await databaseService.run(`UPDATE memories SET access_count = access_count + 1, last_accessed_at = datetime('now') WHERE id = ?`, [id]);
}

export async function updateImportance(id: string, importance: MemoryImportance, score: number): Promise<void> {
  await databaseService.run('UPDATE memories SET importance = ?, importance_score = ? WHERE id = ?', [importance, score, id]);
}

export async function markAsConsolidated(id: string, consolidatedInto: string): Promise<void> {
  await databaseService.run('UPDATE memories SET is_consolidated = 1, consolidated_into = ? WHERE id = ?', [consolidatedInto, id]);
}

export async function deleteMemory(id: string): Promise<void> {
  await databaseService.run('DELETE FROM memories WHERE id = ?', [id]);
}

export async function getMemoryStats(tamagochaiId: string): Promise<MemoryStats> {
  const stats = await databaseService.queryOne<{ total: number; flash: number; consolidated: number; avg_access: number; oldest: string; newest: string }>(
    `SELECT COUNT(*) as total, SUM(CASE WHEN is_flash_memory = 1 THEN 1 ELSE 0 END) as flash,
     SUM(CASE WHEN is_consolidated = 1 THEN 1 ELSE 0 END) as consolidated, AVG(access_count) as avg_access,
     MIN(created_at) as oldest, MAX(created_at) as newest FROM memories WHERE tamagochai_id = ?`, [tamagochaiId]
  );

  const byType = await databaseService.query<{ type: string; count: number }>(
    `SELECT type, COUNT(*) as count FROM memories WHERE tamagochai_id = ? GROUP BY type`, [tamagochaiId]
  );

  const byImportance = await databaseService.query<{ importance: string; count: number }>(
    `SELECT importance, COUNT(*) as count FROM memories WHERE tamagochai_id = ? GROUP BY importance`, [tamagochaiId]
  );

  return {
    totalMemories: stats?.total ?? 0,
    byType: byType.reduce((acc, row) => { acc[row.type as MemoryType] = row.count; return acc; }, {} as Record<MemoryType, number>),
    byImportance: byImportance.reduce((acc, row) => { acc[row.importance as MemoryImportance] = row.count; return acc; }, {} as Record<MemoryImportance, number>),
    flashMemoriesCount: stats?.flash ?? 0,
    consolidatedCount: stats?.consolidated ?? 0,
    averageAccessCount: stats?.avg_access ?? 0,
    oldestMemory: stats?.oldest ? new Date(stats.oldest) : new Date(),
    newestMemory: stats?.newest ? new Date(stats.newest) : new Date(),
  };
}

export async function getMemoriesToConsolidate(tamagochaiId: string, olderThanDays: number = 30, limit: number = 50): Promise<Memory[]> {
  const rows = await databaseService.query<MemoryRow>(
    `SELECT * FROM memories WHERE tamagochai_id = ? AND is_consolidated = 0 AND is_flash_memory = 0
     AND importance IN ('low', 'medium') AND created_at < datetime('now', '-' || ? || ' days')
     ORDER BY importance_score ASC, created_at ASC LIMIT ?`, [tamagochaiId, olderThanDays, limit]
  );
  return rows.map(rowToMemory);
}
