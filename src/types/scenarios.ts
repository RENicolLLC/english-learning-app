export interface RealLifeScenario {
  id: string;
  category: ScenarioCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  context: {
    situation: string;
    location: string;
    participants: string[];
    culturalNotes: string[];
  };
  dialogues: Dialogue[];
  vocabulary: VocabularyItem[];
  grammarPoints: GrammarPoint[];
  exercises: Exercise[];
}

export type ScenarioCategory =
  | 'business'
  | 'travel'
  | 'healthcare'
  | 'education'
  | 'shopping'
  | 'dining'
  | 'socializing'
  | 'emergency'
  | 'transportation'
  | 'accommodation';

export interface Dialogue {
  id: string;
  speakers: string[];
  exchanges: Exchange[];
  variations: DialogueVariation[];
  culturalNotes: string[];
  commonMistakes: CommonMistake[];
}

export interface Exchange {
  speaker: string;
  text: string;
  translation: string;
  pronunciation: string;
  audioUrl: string;
  keyPhrases: string[];
}

export interface DialogueVariation {
  formalityLevel: 'casual' | 'polite' | 'formal';
  exchanges: Exchange[];
}

export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation: string;
  audioUrl: string;
  usageExamples: string[];
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
}

export interface GrammarPoint {
  pattern: string;
  explanation: string;
  examples: string[];
  commonErrors: CommonMistake[];
  practiceExercises: Exercise[];
}

export interface CommonMistake {
  incorrect: string;
  correct: string;
  explanation: string;
  nativeLanguageContext: Record<'zh' | 'vi' | 'ja' | 'th', string>;
}

export interface Exercise {
  type: 'mcq' | 'fillInBlanks' | 'rolePlay' | 'recording' | 'translation';
  question: string;
  options?: string[];
  correctAnswer: string;
  feedback: {
    correct: string;
    incorrect: string;
  };
} 