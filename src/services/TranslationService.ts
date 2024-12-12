import { TranslationPair, LanguageSupport, TranslationContext } from '../types/translation';
import { DatabaseService } from './database';

export class TranslationService {
  private static instance: TranslationService;
  private db: DatabaseService;

  private readonly languageConfigs: Record<string, LanguageSupport> = {
    zh: {
      languageCode: 'zh',
      direction: 'ltr',
      useRomanization: true,
      writingSystem: 'characters'
    },
    vi: {
      languageCode: 'vi',
      direction: 'ltr',
      useRomanization: false,
      writingSystem: 'alphabet'
    },
    ja: {
      languageCode: 'ja',
      direction: 'ltr',
      useRomanization: true,
      writingSystem: 'syllabary'
    },
    th: {
      languageCode: 'th',
      direction: 'ltr',
      useRomanization: true,
      writingSystem: 'alphabet'
    }
  };

  private constructor() {
    this.db = DatabaseService.getInstance();
  }

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  async getTranslation(
    english: string,
    targetLanguage: 'zh' | 'vi' | 'ja' | 'th',
    context?: TranslationContext
  ): Promise<TranslationPair> {
    const query = `
      SELECT 
        translation,
        romanization,
        usage_notes
      FROM translations 
      WHERE 
        english_text = $1 
        AND language_code = $2
        AND context_category = $3
    `;

    const result = await this.db.pool.query(query, [
      english,
      targetLanguage,
      context?.category
    ]);

    return {
      english,
      native: result.rows[0]?.translation || english,
      romanization: result.rows[0]?.romanization,
      notes: result.rows[0]?.usage_notes
    };
  }

  async getBilingualContent(
    content: string,
    targetLanguage: 'zh' | 'vi' | 'ja' | 'th'
  ): Promise<{
    original: string;
    translated: string;
    sideBySide: string;
    withRomanization?: string;
  }> {
    const translation = await this.getTranslation(content, targetLanguage);
    const config = this.languageConfigs[targetLanguage];

    const sideBySide = `${content}\n${translation.native}`;
    const withRomanization = config.useRomanization && translation.romanization
      ? `${content}\n${translation.native}\n(${translation.romanization})`
      : undefined;

    return {
      original: content,
      translated: translation.native,
      sideBySide,
      withRomanization
    };
  }

  async getGrammarExplanation(
    pattern: string,
    targetLanguage: 'zh' | 'vi' | 'ja' | 'th'
  ): Promise<{
    explanation: TranslationPair;
    examples: TranslationPair[];
    commonErrors: TranslationPair[];
  }> {
    // Implementation for grammar explanations in native language
    return {
      explanation: await this.getTranslation(pattern, targetLanguage),
      examples: [],
      commonErrors: []
    };
  }
} 