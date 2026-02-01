// src/services/database/queries/hormones.ts
// Queries CRUD pour le système hormonal

import { databaseService } from '../DatabaseService';
import { HormoneType, HormoneLevels, HormoneState, HormoneModifier } from '../../../types';
import { DEFAULT_HORMONE_LEVELS } from '../../../constants';

interface HormoneStateRow {
  id: number;
  tamagochai_id: string;
  dopamine: number;
  serotonin: number;
  oxytocin: number;
  cortisol: number;
  adrenaline: number;
  endorphins: number;
  last_update: string;
  last_decay: string;
}

interface HormoneHistoryRow {
  id: number;
  tamagochai_id: string;
  dopamine: number;
  serotonin: number;
  oxytocin: number;
  cortisol: number;
  adrenaline: number;
  endorphins: number;
  trigger_event: string | null;
  recorded_at: string;
}

function rowToLevels(row: HormoneStateRow | HormoneHistoryRow): HormoneLevels {
  return {
    dopamine: row.dopamine,
    serotonin: row.serotonin,
    oxytocin: row.oxytocin,
    cortisol: row.cortisol,
    adrenaline: row.adrenaline,
    endorphins: row.endorphins,
  };
}

export async function getHormoneState(tamagochaiId: string): Promise<HormoneState | null> {
  const row = await databaseService.queryOne<HormoneStateRow>('SELECT * FROM hormone_state WHERE tamagochai_id = ?', [tamagochaiId]);
  if (!row) return null;
  return {
    levels: rowToLevels(row),
    lastUpdate: new Date(row.last_update),
    lastDecay: new Date(row.last_decay),
  };
}

export async function getHormoneLevels(tamagochaiId: string): Promise<HormoneLevels> {
  const state = await getHormoneState(tamagochaiId);
  return state?.levels ?? DEFAULT_HORMONE_LEVELS;
}

export async function updateHormoneLevels(tamagochaiId: string, levels: HormoneLevels): Promise<void> {
  await databaseService.run(
    `UPDATE hormone_state SET dopamine = ?, serotonin = ?, oxytocin = ?, cortisol = ?, adrenaline = ?, endorphins = ?, last_update = datetime('now') WHERE tamagochai_id = ?`,
    [levels.dopamine, levels.serotonin, levels.oxytocin, levels.cortisol, levels.adrenaline, levels.endorphins, tamagochaiId]
  );
}

export async function updateSingleHormone(tamagochaiId: string, hormone: HormoneType, value: number): Promise<void> {
  const clampedValue = Math.max(0, Math.min(100, value));
  await databaseService.run(`UPDATE hormone_state SET ${hormone} = ?, last_update = datetime('now') WHERE tamagochai_id = ?`, [clampedValue, tamagochaiId]);
}

export async function applyModifiers(tamagochaiId: string, modifiers: HormoneModifier[], trigger: string): Promise<HormoneLevels> {
  const currentLevels = await getHormoneLevels(tamagochaiId);
  for (const modifier of modifiers) {
    const current = currentLevels[modifier.hormone];
    currentLevels[modifier.hormone] = Math.max(0, Math.min(100, current + modifier.delta));
  }
  await updateHormoneLevels(tamagochaiId, currentLevels);
  await recordHormoneHistory(tamagochaiId, currentLevels, trigger);
  return currentLevels;
}

export async function updateLastDecay(tamagochaiId: string): Promise<void> {
  await databaseService.run(`UPDATE hormone_state SET last_decay = datetime('now') WHERE tamagochai_id = ?`, [tamagochaiId]);
}

export async function recordHormoneHistory(tamagochaiId: string, levels: HormoneLevels, trigger?: string): Promise<void> {
  await databaseService.run(
    `INSERT INTO hormone_history (tamagochai_id, dopamine, serotonin, oxytocin, cortisol, adrenaline, endorphins, trigger_event) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [tamagochaiId, levels.dopamine, levels.serotonin, levels.oxytocin, levels.cortisol, levels.adrenaline, levels.endorphins, trigger || null]
  );
}

export async function getHormoneHistory(tamagochaiId: string, limit: number = 50): Promise<{ levels: HormoneLevels; trigger: string | null; recordedAt: Date }[]> {
  const rows = await databaseService.query<HormoneHistoryRow>(
    `SELECT * FROM hormone_history WHERE tamagochai_id = ? ORDER BY recorded_at DESC LIMIT ?`, [tamagochaiId, limit]
  );
  return rows.map(row => ({ levels: rowToLevels(row), trigger: row.trigger_event, recordedAt: new Date(row.recorded_at) }));
}

export async function getHormoneHistoryForPeriod(tamagochaiId: string, from: Date, to: Date): Promise<{ levels: HormoneLevels; trigger: string | null; recordedAt: Date }[]> {
  const rows = await databaseService.query<HormoneHistoryRow>(
    `SELECT * FROM hormone_history WHERE tamagochai_id = ? AND recorded_at >= ? AND recorded_at <= ? ORDER BY recorded_at ASC`,
    [tamagochaiId, from.toISOString(), to.toISOString()]
  );
  return rows.map(row => ({ levels: rowToLevels(row), trigger: row.trigger_event, recordedAt: new Date(row.recorded_at) }));
}

export async function getAverageHormones(tamagochaiId: string, from: Date, to: Date): Promise<HormoneLevels> {
  const result = await databaseService.queryOne<{
    avg_dopamine: number; avg_serotonin: number; avg_oxytocin: number;
    avg_cortisol: number; avg_adrenaline: number; avg_endorphins: number;
  }>(
    `SELECT AVG(dopamine) as avg_dopamine, AVG(serotonin) as avg_serotonin, AVG(oxytocin) as avg_oxytocin,
     AVG(cortisol) as avg_cortisol, AVG(adrenaline) as avg_adrenaline, AVG(endorphins) as avg_endorphins
     FROM hormone_history WHERE tamagochai_id = ? AND recorded_at >= ? AND recorded_at <= ?`,
    [tamagochaiId, from.toISOString(), to.toISOString()]
  );
  if (!result) return DEFAULT_HORMONE_LEVELS;
  return {
    dopamine: result.avg_dopamine ?? DEFAULT_HORMONE_LEVELS.dopamine,
    serotonin: result.avg_serotonin ?? DEFAULT_HORMONE_LEVELS.serotonin,
    oxytocin: result.avg_oxytocin ?? DEFAULT_HORMONE_LEVELS.oxytocin,
    cortisol: result.avg_cortisol ?? DEFAULT_HORMONE_LEVELS.cortisol,
    adrenaline: result.avg_adrenaline ?? DEFAULT_HORMONE_LEVELS.adrenaline,
    endorphins: result.avg_endorphins ?? DEFAULT_HORMONE_LEVELS.endorphins,
  };
}

export async function getDominantHormone(tamagochaiId: string): Promise<{ hormone: HormoneType; level: number; deviation: number }> {
  const levels = await getHormoneLevels(tamagochaiId);
  const baselines: Record<HormoneType, number> = { dopamine: 50, serotonin: 60, oxytocin: 55, cortisol: 25, adrenaline: 20, endorphins: 40 };
  let dominant: HormoneType = 'dopamine';
  let maxDeviation = 0;
  for (const [hormone, level] of Object.entries(levels)) {
    const deviation = Math.abs(level - baselines[hormone as HormoneType]);
    if (deviation > maxDeviation) { maxDeviation = deviation; dominant = hormone as HormoneType; }
  }
  return { hormone: dominant, level: levels[dominant], deviation: maxDeviation };
}

export async function cleanOldHistory(tamagochaiId: string, keepDays: number = 30): Promise<number> {
  const result = await databaseService.run(
    `DELETE FROM hormone_history WHERE tamagochai_id = ? AND recorded_at < datetime('now', '-' || ? || ' days')`, [tamagochaiId, keepDays]
  );
  return result.changes;
}

export async function resetHormones(tamagochaiId: string): Promise<void> {
  await updateHormoneLevels(tamagochaiId, DEFAULT_HORMONE_LEVELS);
  await recordHormoneHistory(tamagochaiId, DEFAULT_HORMONE_LEVELS, 'reset');
}
