// src/services/database/migrations/index.ts
// Index des migrations

import { migration_001_initial } from './001_initial';

/**
 * Type d'une migration
 */
export interface Migration {
  name: string;
  up: string;
}

/**
 * Liste des migrations dans l'ordre d'exécution
 * IMPORTANT: Ne jamais modifier une migration existante !
 * Pour des changements, créer une nouvelle migration.
 */
export const migrations: Migration[] = [
  migration_001_initial,
  // Futures migrations ici:
  // migration_002_add_dreams,
  // migration_003_add_achievements,
];
