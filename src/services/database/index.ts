// src/services/database/index.ts
// Export principal du module database

// Service principal
export { databaseService, default } from './DatabaseService';

// Toutes les queries
export * from './queries';

// Types de migrations
export type { Migration } from './migrations';
