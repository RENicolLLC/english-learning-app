export interface UserProgress {
  userId: string;
  nativeLanguage: 'zh' | 'vi' | 'ja' | 'th';  // Chinese, Vietnamese, Japanese, Thai
  currentLevel: number;
  completedLessons: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface PronunciationScore {
  accuracy: number;
  fluency: number;
  problemSounds: string[];
  recommendations: string[];
}

export interface LearningMetrics {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  nextLevelEstimate: number;
  pronunciationDetails?: PronunciationScore;
}

export interface LanguageSpecificChallenges {
  zh: {  // Chinese
    commonErrors: string[];
    soundPairs: string[][];  // Example: ['l', 'r'], ['th', 's']
    toneIssues: string[];
  };
  vi: {  // Vietnamese
    commonErrors: string[];
    soundPairs: string[][];
    finalConsonants: string[];
  };
  ja: {  // Japanese
    commonErrors: string[];
    soundPairs: string[][];
    consonantClusters: string[];
  };
  th: {  // Thai
    commonErrors: string[];
    soundPairs: string[][];
    finalStops: string[];
  };
} 