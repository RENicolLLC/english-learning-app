import { Migration } from './Migration';
import { DatabaseService } from '../../services/database';

export class LanguageSpecificMigration implements Migration {
  version = 2;
  private db = DatabaseService.getInstance();

  async up(): Promise<void> {
    await this.db.pool.query(`
      -- Language-specific pronunciation challenges
      CREATE TABLE pronunciation_challenges (
        challenge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        native_language VARCHAR(10) NOT NULL,
        target_sound VARCHAR(50) NOT NULL,
        common_mistakes JSONB,
        examples TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Language-specific grammar patterns
      CREATE TABLE grammar_patterns (
        pattern_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        native_language VARCHAR(10) NOT NULL,
        english_pattern TEXT NOT NULL,
        native_equivalent TEXT,
        common_errors JSONB,
        examples TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX idx_pronunciation_language ON pronunciation_challenges(native_language);
      CREATE INDEX idx_grammar_language ON grammar_patterns(native_language);
    `);
  }

  async down(): Promise<void> {
    await this.db.pool.query(`
      DROP TABLE IF EXISTS pronunciation_challenges;
      DROP TABLE IF EXISTS grammar_patterns;
    `);
  }
} 