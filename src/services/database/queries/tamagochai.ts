// src/services/database/queries/tamagochai.ts
// Queries CRUD pour la table tamagochai

import { databaseService } from '../DatabaseService';
import { generateUUID } from '../../../utils';
import {
  TamagochaiState,
  Genome,
  TamagochaiStats,
  AvatarConfig,
  EvolutionStage,
  CreateTamagochaiConfig,
} from '../../../types';
import { DEFAULT_AVATAR_CONFIG, DEFAULT_HORMONE_LEVELS } from '../../../constants';

interface TamagochaiRow {
  id: string;
  name: string;
  created_at: string;
  last_interaction_at: string;
  is_first_launch: number;
  genome_social: number;
  genome_cognitive: number;
  genome_emotional: number;
  genome_energy: number;
  genome_creativity: number;
  avatar_type: string;
  avatar_style: string;
  avatar_color: string;
  current_stage: string;
  total_xp: number;
  total_messages: number;
  total_conversations: number;
  days_alive: number;
  current_streak: number;
  longest_streak: number;
}

function rowToTamagochai(row: TamagochaiRow): Partial<TamagochaiState> {
  return {
    id: row.id,
    name: row.name,
    createdAt: new Date(row.created_at),
    lastInteractionAt: new Date(row.last_interaction_at),
    isFirstLaunch: row.is_first_launch === 1,
    genome: {
      social: row.genome_social,
      cognitive: row.genome_cognitive,
      emotional: row.genome_emotional,
      energy: row.genome_energy,
      creativity: row.genome_creativity,
    },
    avatar: {
      type: row.avatar_type as any,
      style: row.avatar_style as any,
      color: row.avatar_color as any,
      currentExpression: 'neutral',
      equippedItems: {
        head: null,
        face: null,
        body: null,
        accessory: null,
        background: 'bg_gradient_blue',
        effect: null,
      },
    },
    stage: row.current_stage as EvolutionStage,
    xp: row.total_xp,
    stats: {
      totalMessages: row.total_messages,
      totalConversations: row.total_conversations,
      totalXP: row.total_xp,
      currentStage: row.current_stage as EvolutionStage,
      daysAlive: row.days_alive,
      currentStreak: row.current_streak,
      longestStreak: row.longest_streak,
      memoriesCount: 0,
      flashMemoriesCount: 0,
    },
  };
}

export async function createTamagochai(config: CreateTamagochaiConfig): Promise<string> {
  const id = generateUUID();
  const genome = config.genome || {};
  const avatar = config.avatar || DEFAULT_AVATAR_CONFIG;

  await databaseService.run(
    `INSERT INTO tamagochai (
      id, name, genome_social, genome_cognitive, genome_emotional, genome_energy, genome_creativity,
      avatar_type, avatar_style, avatar_color
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, config.name, genome.social ?? 50, genome.cognitive ?? 50, genome.emotional ?? 50,
     genome.energy ?? 50, genome.creativity ?? 50, avatar.type, avatar.style, avatar.color]
  );

  await databaseService.run(
    `INSERT INTO hormone_state (tamagochai_id, dopamine, serotonin, oxytocin, cortisol, adrenaline, endorphins)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, DEFAULT_HORMONE_LEVELS.dopamine, DEFAULT_HORMONE_LEVELS.serotonin, DEFAULT_HORMONE_LEVELS.oxytocin,
     DEFAULT_HORMONE_LEVELS.cortisol, DEFAULT_HORMONE_LEVELS.adrenaline, DEFAULT_HORMONE_LEVELS.endorphins]
  );

  return id;
}

export async function getTamagochaiById(id: string): Promise<Partial<TamagochaiState> | null> {
  const row = await databaseService.queryOne<TamagochaiRow>('SELECT * FROM tamagochai WHERE id = ?', [id]);
  if (!row) return null;
  return rowToTamagochai(row);
}

export async function getActiveTamagochai(): Promise<Partial<TamagochaiState> | null> {
  const row = await databaseService.queryOne<TamagochaiRow>('SELECT * FROM tamagochai ORDER BY created_at DESC LIMIT 1');
  if (!row) return null;
  return rowToTamagochai(row);
}

export async function tamagochaiExists(): Promise<boolean> {
  const result = await databaseService.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM tamagochai');
  return (result?.count ?? 0) > 0;
}

export async function updateName(id: string, name: string): Promise<void> {
  await databaseService.run('UPDATE tamagochai SET name = ? WHERE id = ?', [name, id]);
}

export async function updateAvatar(id: string, avatar: Partial<AvatarConfig>): Promise<void> {
  const updates: string[] = [];
  const params: any[] = [];
  if (avatar.type) { updates.push('avatar_type = ?'); params.push(avatar.type); }
  if (avatar.style) { updates.push('avatar_style = ?'); params.push(avatar.style); }
  if (avatar.color) { updates.push('avatar_color = ?'); params.push(avatar.color); }
  if (updates.length > 0) {
    params.push(id);
    await databaseService.run(`UPDATE tamagochai SET ${updates.join(', ')} WHERE id = ?`, params);
  }
}

export async function updateStage(id: string, stage: EvolutionStage): Promise<void> {
  await databaseService.run('UPDATE tamagochai SET current_stage = ? WHERE id = ?', [stage, id]);
}

export async function addXP(id: string, amount: number): Promise<number> {
  await databaseService.run('UPDATE tamagochai SET total_xp = total_xp + ? WHERE id = ?', [amount, id]);
  const result = await databaseService.queryOne<{ total_xp: number }>('SELECT total_xp FROM tamagochai WHERE id = ?', [id]);
  return result?.total_xp ?? 0;
}

export async function incrementMessageCount(id: string): Promise<void> {
  await databaseService.run('UPDATE tamagochai SET total_messages = total_messages + 1 WHERE id = ?', [id]);
}

export async function incrementConversationCount(id: string): Promise<void> {
  await databaseService.run('UPDATE tamagochai SET total_conversations = total_conversations + 1 WHERE id = ?', [id]);
}

export async function updateLastInteraction(id: string): Promise<void> {
  await databaseService.run("UPDATE tamagochai SET last_interaction_at = datetime('now') WHERE id = ?", [id]);
}

export async function updateStreak(id: string, currentStreak: number, longestStreak: number): Promise<void> {
  await databaseService.run('UPDATE tamagochai SET current_streak = ?, longest_streak = ? WHERE id = ?', [currentStreak, longestStreak, id]);
}

export async function updateDaysAlive(id: string, days: number): Promise<void> {
  await databaseService.run('UPDATE tamagochai SET days_alive = ? WHERE id = ?', [days, id]);
}

export async function markFirstLaunchComplete(id: string): Promise<void> {
  await databaseService.run('UPDATE tamagochai SET is_first_launch = 0 WHERE id = ?', [id]);
}

export async function deleteTamagochai(id: string): Promise<void> {
  await databaseService.run('DELETE FROM tamagochai WHERE id = ?', [id]);
}

export async function getStats(id: string): Promise<TamagochaiStats | null> {
  const row = await databaseService.queryOne<TamagochaiRow>('SELECT * FROM tamagochai WHERE id = ?', [id]);
  if (!row) return null;
  const memoriesResult = await databaseService.queryOne<{ total: number; flash: number }>(
    `SELECT COUNT(*) as total, SUM(CASE WHEN is_flash_memory = 1 THEN 1 ELSE 0 END) as flash FROM memories WHERE tamagochai_id = ?`, [id]
  );
  return {
    totalMessages: row.total_messages,
    totalConversations: row.total_conversations,
    totalXP: row.total_xp,
    currentStage: row.current_stage as EvolutionStage,
    daysAlive: row.days_alive,
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    memoriesCount: memoriesResult?.total ?? 0,
    flashMemoriesCount: memoriesResult?.flash ?? 0,
  };
}
