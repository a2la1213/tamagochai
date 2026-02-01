// src/services/database/DatabaseService.ts
// Service principal de base de données SQLite

import * as SQLite from 'expo-sqlite';
import { APP_CONFIG } from '../../constants';
import { migrations, Migration } from './migrations';

/**
 * Service de base de données SQLite
 * Singleton pattern pour une seule instance
 */
class DatabaseService {
  private static instance: DatabaseService;
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

  /**
   * Obtient l'instance unique du service
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Initialise la base de données
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[DB] Already initialized');
      return;
    }

    try {
      console.log('[DB] Opening database...');
      this.db = await SQLite.openDatabaseAsync(APP_CONFIG.database.name);
      
      // Activer les foreign keys
      await this.db.execAsync('PRAGMA foreign_keys = ON;');
      
      // Activer WAL mode pour meilleures performances
      await this.db.execAsync('PRAGMA journal_mode = WAL;');
      
      // Exécuter les migrations
      await this.runMigrations();
      
      this.isInitialized = true;
      console.log('[DB] Database initialized successfully');
    } catch (error) {
      console.error('[DB] Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Obtient la connexion à la base de données
   */
  public getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Vérifie si la base de données est initialisée
   */
  public isReady(): boolean {
    return this.isInitialized && this.db !== null;
  }

  /**
   * Exécute les migrations
   */
  private async runMigrations(): Promise<void> {
    if (!this.db) throw new Error('Database not open');

    // Créer la table de migrations si elle n'existe pas
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        executed_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Récupérer les migrations déjà exécutées
    const executedMigrations = await this.db.getAllAsync<{ name: string }>(
      'SELECT name FROM migrations ORDER BY id'
    );
    const executedNames = new Set(executedMigrations.map(m => m.name));

    // Exécuter les nouvelles migrations
    for (const migration of migrations) {
      if (!executedNames.has(migration.name)) {
        console.log(`[DB] Running migration: ${migration.name}`);
        try {
          await this.db.execAsync(migration.up);
          await this.db.runAsync(
            'INSERT INTO migrations (name) VALUES (?)',
            [migration.name]
          );
          console.log(`[DB] Migration ${migration.name} completed`);
        } catch (error) {
          console.error(`[DB] Migration ${migration.name} failed:`, error);
          throw error;
        }
      }
    }
  }

  /**
   * Obtient la version actuelle du schéma
   */
  public async getSchemaVersion(): Promise<number> {
    if (!this.db) return 0;
    
    const result = await this.db.getAllAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM migrations'
    );
    return result[0]?.count ?? 0;
  }

  /**
   * Exécute une requête SELECT
   */
  public async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.getAllAsync<T>(sql, params);
  }

  /**
   * Exécute une requête SELECT pour un seul résultat
   */
  public async queryOne<T>(sql: string, params: any[] = []): Promise<T | null> {
    if (!this.db) throw new Error('Database not initialized');
    const result = await this.db.getFirstAsync<T>(sql, params);
    return result ?? null;
  }

  /**
   * Exécute une requête INSERT/UPDATE/DELETE
   */
  public async run(sql: string, params: any[] = []): Promise<SQLite.SQLiteRunResult> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.runAsync(sql, params);
  }

  /**
   * Exécute plusieurs requêtes dans une transaction
   */
  public async transaction<T>(
    callback: (db: SQLite.SQLiteDatabase) => Promise<T>
  ): Promise<T> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.execAsync('BEGIN TRANSACTION');
    try {
      const result = await callback(this.db);
      await this.db.execAsync('COMMIT');
      return result;
    } catch (error) {
      await this.db.execAsync('ROLLBACK');
      throw error;
    }
  }

  /**
   * Ferme la connexion à la base de données
   */
  public async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.isInitialized = false;
      console.log('[DB] Database closed');
    }
  }

  /**
   * Supprime toutes les données (pour debug/reset)
   */
  public async resetDatabase(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    console.log('[DB] Resetting database...');
    
    // Récupérer toutes les tables
    const tables = await this.db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'migrations'"
    );
    
    // Supprimer toutes les tables
    await this.db.execAsync('PRAGMA foreign_keys = OFF;');
    for (const table of tables) {
      await this.db.execAsync(`DROP TABLE IF EXISTS ${table.name};`);
    }
    await this.db.execAsync('DELETE FROM migrations;');
    await this.db.execAsync('PRAGMA foreign_keys = ON;');
    
    // Ré-exécuter les migrations
    await this.runMigrations();
    
    console.log('[DB] Database reset complete');
  }
}

// Export de l'instance singleton
export const databaseService = DatabaseService.getInstance();
export default databaseService;
