import { Migration } from './Migration';
import { DatabaseService } from '../../services/database';

export class TranslationsSchemaMigration implements Migration {
  version = 3;
  private db = DatabaseService.getInstance();

  async up(): Promise<void> {
    await this.db.pool.query(`
      -- Translations table
      CREATE TABLE translations (
        translation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        english_text TEXT NOT NULL,
        language_code VARCHAR(2) NOT NULL,
        translation TEXT NOT NULL,
        romanization TEXT,
        usage_notes TEXT,
        context_category VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(english_text, language_code, context_category)
      );

      -- Grammar patterns for each language
      CREATE TABLE grammar_translations (
        pattern_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        english_pattern TEXT NOT NULL,
        language_code VARCHAR(2) NOT NULL,
        translated_pattern TEXT NOT NULL,
        romanization TEXT,
        explanation TEXT,
        usage_examples JSONB,
        common_errors JSONB,
        difficulty_level INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Cultural context notes
      CREATE TABLE cultural_notes (
        note_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        language_code VARCHAR(2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        english_context TEXT NOT NULL,
        native_context TEXT NOT NULL,
        importance_level INTEGER,
        usage_scenarios TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Common mistakes by language
      CREATE TABLE language_specific_mistakes (
        mistake_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        language_code VARCHAR(2) NOT NULL,
        english_correct TEXT NOT NULL,
        english_mistake TEXT NOT NULL,
        native_explanation TEXT NOT NULL,
        correction_tips TEXT[],
        practice_exercises JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Idioms and expressions
      CREATE TABLE idioms_translations (
        idiom_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        english_idiom TEXT NOT NULL,
        language_code VARCHAR(2) NOT NULL,
        translated_idiom TEXT NOT NULL,
        literal_translation TEXT,
        meaning_explanation TEXT,
        usage_examples JSONB,
        cultural_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX idx_translations_language ON translations(language_code);
      CREATE INDEX idx_translations_context ON translations(context_category);
      CREATE INDEX idx_grammar_language ON grammar_translations(language_code);
      CREATE INDEX idx_cultural_notes_language ON cultural_notes(language_code, category);
      CREATE INDEX idx_mistakes_language ON language_specific_mistakes(language_code);
      CREATE INDEX idx_idioms_language ON idioms_translations(language_code);
    `);
  }

  async down(): Promise<void> {
    await this.db.pool.query(`
      DROP TABLE IF EXISTS idioms_translations;
      DROP TABLE IF EXISTS language_specific_mistakes;
      DROP TABLE IF EXISTS cultural_notes;
      DROP TABLE IF EXISTS grammar_translations;
      DROP TABLE IF EXISTS translations;
    `);
  }
} 