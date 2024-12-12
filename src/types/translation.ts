export interface Translation {
  sourceText: string;
  targetText: string;
  language: string;
  romanization?: string;
  notes?: string;
}

export interface TranslationPair {
  english: string;
  native: string;
  romanization?: string;
  notes?: string;
}

export interface LanguageSupport {
  languageCode: 'zh' | 'vi' | 'ja' | 'th';
  direction: 'ltr' | 'rtl';
  useRomanization: boolean;
  writingSystem: 'alphabet' | 'characters' | 'syllabary';
}

export interface TranslationContext {
  category: 'grammar' | 'vocabulary' | 'idioms' | 'phrases';
  usage: string[];
  commonErrors: string[];
  culturalNotes?: string[];
} 