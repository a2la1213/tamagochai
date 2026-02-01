// src/services/database/migrations/001_initial.ts
// Migration initiale - Schéma complet de la base de données

export const migration_001_initial = {
  name: '001_initial',
  up: `
    -- ============================================================
    -- TAMAGOCHAI (table principale)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS tamagochai (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      last_interaction_at TEXT DEFAULT (datetime('now')),
      is_first_launch INTEGER DEFAULT 1,
      
      -- Génome (traits innés, immuables)
      genome_social INTEGER DEFAULT 50,
      genome_cognitive INTEGER DEFAULT 50,
      genome_emotional INTEGER DEFAULT 50,
      genome_energy INTEGER DEFAULT 50,
      genome_creativity INTEGER DEFAULT 50,
      
      -- Avatar
      avatar_type TEXT DEFAULT 'robot',
      avatar_style TEXT DEFAULT 'neutral',
      avatar_color TEXT DEFAULT 'blue',
      
      -- Évolution
      current_stage TEXT DEFAULT 'emergence',
      total_xp INTEGER DEFAULT 0,
      
      -- Statistiques
      total_messages INTEGER DEFAULT 0,
      total_conversations INTEGER DEFAULT 0,
      days_alive INTEGER DEFAULT 0,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0
    );

    -- ============================================================
    -- HORMONE STATE (état actuel des hormones)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS hormone_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      tamagochai_id TEXT NOT NULL,
      dopamine REAL DEFAULT 50.0,
      serotonin REAL DEFAULT 60.0,
      oxytocin REAL DEFAULT 55.0,
      cortisol REAL DEFAULT 25.0,
      adrenaline REAL DEFAULT 20.0,
      endorphins REAL DEFAULT 40.0,
      last_update TEXT DEFAULT (datetime('now')),
      last_decay TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (tamagochai_id) REFERENCES tamagochai(id) ON DELETE CASCADE
    );

    -- ============================================================
    -- HORMONE HISTORY (historique des changements)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS hormone_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tamagochai_id TEXT NOT NULL,
      dopamine REAL,
      serotonin REAL,
      oxytocin REAL,
      cortisol REAL,
      adrenaline REAL,
      endorphins REAL,
      trigger_event TEXT,
      recorded_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (tamagochai_id) REFERENCES tamagochai(id) ON DELETE CASCADE
    );

    -- ============================================================
    -- CONVERSATIONS
    -- ============================================================
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      tamagochai_id TEXT NOT NULL,
      title TEXT,
      summary TEXT,
      topics TEXT DEFAULT '[]',
      mood TEXT DEFAULT 'neutral',
      message_count INTEGER DEFAULT 0,
      xp_earned INTEGER DEFAULT 0,
      memories_created INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      ended_at TEXT,
      end_reason TEXT,
      FOREIGN KEY (tamagochai_id) REFERENCES tamagochai(id) ON DELETE CASCADE
    );

    -- ============================================================
    -- MESSAGES
    -- ============================================================
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      content_type TEXT DEFAULT 'text',
      tokens_used INTEGER,
      generation_time INTEGER,
      emotion_at_time TEXT,
      hormone_snapshot TEXT,
      is_edited INTEGER DEFAULT 0,
      edited_at TEXT,
      is_regenerated INTEGER DEFAULT 0,
      regeneration_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );

    -- ============================================================
    -- MEMORIES (souvenirs)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      tamagochai_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('fact', 'event', 'emotion', 'preference', 'relationship', 'topic', 'flash')),
      content TEXT NOT NULL,
      summary TEXT NOT NULL,
      importance TEXT DEFAULT 'medium' CHECK (importance IN ('low', 'medium', 'high', 'critical')),
      importance_score INTEGER DEFAULT 50,
      conversation_id TEXT,
      message_id TEXT,
      topics TEXT DEFAULT '[]',
      emotion_at_creation TEXT,
      emotional_valence REAL DEFAULT 0,
      access_count INTEGER DEFAULT 0,
      is_consolidated INTEGER DEFAULT 0,
      consolidated_into TEXT,
      is_flash_memory INTEGER DEFAULT 0,
      flash_trigger TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      last_accessed_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (tamagochai_id) REFERENCES tamagochai(id) ON DELETE CASCADE,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL
    );

    -- ============================================================
    -- MEMORIES FTS (recherche full-text)
    -- ============================================================
    CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(
      content,
      summary,
      topics,
      content='memories',
      content_rowid='rowid'
    );

    -- Triggers pour synchroniser FTS
    CREATE TRIGGER IF NOT EXISTS memories_ai AFTER INSERT ON memories BEGIN
      INSERT INTO memories_fts(rowid, content, summary, topics)
      VALUES (NEW.rowid, NEW.content, NEW.summary, NEW.topics);
    END;

    CREATE TRIGGER IF NOT EXISTS memories_ad AFTER DELETE ON memories BEGIN
      INSERT INTO memories_fts(memories_fts, rowid, content, summary, topics)
      VALUES ('delete', OLD.rowid, OLD.content, OLD.summary, OLD.topics);
    END;

    CREATE TRIGGER IF NOT EXISTS memories_au AFTER UPDATE ON memories BEGIN
      INSERT INTO memories_fts(memories_fts, rowid, content, summary, topics)
      VALUES ('delete', OLD.rowid, OLD.content, OLD.summary, OLD.topics);
      INSERT INTO memories_fts(rowid, content, summary, topics)
      VALUES (NEW.rowid, NEW.content, NEW.summary, NEW.topics);
    END;

    -- ============================================================
    -- XP EVENTS (historique des gains d'XP)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS xp_events (
      id TEXT PRIMARY KEY,
      tamagochai_id TEXT NOT NULL,
      source TEXT NOT NULL,
      amount INTEGER NOT NULL,
      base_amount INTEGER NOT NULL,
      multiplier REAL DEFAULT 1.0,
      metadata TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (tamagochai_id) REFERENCES tamagochai(id) ON DELETE CASCADE
    );

    -- ============================================================
    -- EVOLUTION EVENTS (transitions de stade)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS evolution_events (
      id TEXT PRIMARY KEY,
      tamagochai_id TEXT NOT NULL,
      from_stage TEXT NOT NULL,
      to_stage TEXT NOT NULL,
      xp_at_transition INTEGER NOT NULL,
      celebration_shown INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (tamagochai_id) REFERENCES tamagochai(id) ON DELETE CASCADE
    );

    -- ============================================================
    -- XP COOLDOWNS (anti-grind)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS xp_cooldowns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tamagochai_id TEXT NOT NULL,
      source TEXT NOT NULL,
      last_grant TEXT DEFAULT (datetime('now')),
      count_today INTEGER DEFAULT 1,
      date TEXT DEFAULT (date('now')),
      UNIQUE(tamagochai_id, source, date),
      FOREIGN KEY (tamagochai_id) REFERENCES tamagochai(id) ON DELETE CASCADE
    );

    -- ============================================================
    -- SENSOR EVENTS (événements capteurs)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS sensor_events (
      id TEXT PRIMARY KEY,
      tamagochai_id TEXT NOT NULL,
      sensor_type TEXT NOT NULL,
      trigger_name TEXT NOT NULL,
      data TEXT,
      reacted INTEGER DEFAULT 0,
      reaction_type TEXT,
      reaction_content TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (tamagochai_id) REFERENCES tamagochai(id) ON DELETE CASCADE
    );

    -- ============================================================
    -- AVATAR ITEMS (items possédés)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS owned_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tamagochai_id TEXT NOT NULL,
      item_id TEXT NOT NULL,
      acquired_at TEXT DEFAULT (datetime('now')),
      acquired_by TEXT DEFAULT 'gift',
      is_equipped INTEGER DEFAULT 0,
      UNIQUE(tamagochai_id, item_id),
      FOREIGN KEY (tamagochai_id) REFERENCES tamagochai(id) ON DELETE CASCADE
    );

    -- ============================================================
    -- SETTINGS (paramètres utilisateur)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- ============================================================
    -- DAILY STATS (statistiques journalières)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS daily_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tamagochai_id TEXT NOT NULL,
      date TEXT NOT NULL,
      messages_sent INTEGER DEFAULT 0,
      messages_received INTEGER DEFAULT 0,
      xp_gained INTEGER DEFAULT 0,
      memories_created INTEGER DEFAULT 0,
      session_count INTEGER DEFAULT 0,
      total_session_seconds INTEGER DEFAULT 0,
      avg_mood_score REAL,
      dominant_emotion TEXT,
      UNIQUE(tamagochai_id, date),
      FOREIGN KEY (tamagochai_id) REFERENCES tamagochai(id) ON DELETE CASCADE
    );

    -- ============================================================
    -- INDEX pour performances
    -- ============================================================
    CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
    CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_memories_tamagochai ON memories(tamagochai_id);
    CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);
    CREATE INDEX IF NOT EXISTS idx_memories_importance ON memories(importance_score DESC);
    CREATE INDEX IF NOT EXISTS idx_xp_events_tamagochai ON xp_events(tamagochai_id);
    CREATE INDEX IF NOT EXISTS idx_xp_events_created ON xp_events(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_conversations_tamagochai ON conversations(tamagochai_id);
    CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_hormone_history_date ON hormone_history(recorded_at DESC);
    CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date DESC);
  `,
};
