import { Translation } from '../types/translation';

export interface PronunciationAssessment {
  text: string;
  confidence: number;
  words: WordAssessment[];
  overallAccuracy: number;
  suggestions: string[];
}

export interface WordAssessment {
  word: string;
  confidence: number;
  startTime: number;
  endTime: number;
  accuracy: number;
  stress: number;
  suggestions: string[];
}

export interface PhonemeAssessment {
  phoneme: string;
  accuracy: number;
  startTime: number;
  endTime: number;
  isCorrect: boolean;
}

export interface SyllableAssessment {
  syllable: string;
  stress: number;
  phonemes: PhonemeAssessment[];
  startTime: number;
  endTime: number;
}

export interface PronunciationError {
  type: PronunciationErrorType;
  word: string;
  expected: string;
  actual: string;
  position: number;
  suggestion: string;
}

export enum PronunciationErrorType {
  SUBSTITUTION = 'SUBSTITUTION',
  INSERTION = 'INSERTION',
  DELETION = 'DELETION',
  STRESS = 'STRESS',
  INTONATION = 'INTONATION'
}

export interface PronunciationFeedback {
  errors: PronunciationError[];
  suggestions: string[];
  overallScore: number;
  areas: {
    accuracy: number;
    fluency: number;
    stress: number;
    intonation: number;
  };
}

export interface AudioFeatures {
  pitch: number[];
  energy: number[];
  duration: number;
  zeroCrossings: number;
  spectralCentroid: number[];
  mfcc: number[][];
} 