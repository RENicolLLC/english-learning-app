export interface AzureSpeechConfig {
  subscriptionKey: string;
  region: string;
  language: string;
}

export interface PronunciationAssessment {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  pronunciationScore: number;
  words: WordAssessment[];
}

export interface WordAssessment {
  word: string;
  offset: number;
  duration: number;
  accuracyScore: number;
  phonemes: PhonemeAssessment[];
  syllables: SyllableAssessment[];
}

export interface PhonemeAssessment {
  phoneme: string;
  accuracyScore: number;
  error?: string;
}

export interface SyllableAssessment {
  syllable: string;
  accuracyScore: number;
  stress?: {
    expected: number;
    actual: number;
  };
} 