export type AssessmentType = 'quiz' | 'speaking' | 'writing' | 'comprehensive';

export interface Assessment {
  id: string;
  type: AssessmentType;
  level: number;
  questions: Question[];
  timeLimit: number;
  passingScore: number;
  targetSkills: string[];
  instructions: {
    [key in 'zh' | 'vi' | 'ja' | 'th']: string;
  };
}

export interface Question {
  id: string;
  type: QuestionType;
  content: QuestionContent;
  correctAnswer: string | string[];
  points: number;
  difficulty: 1 | 2 | 3;
  explanation: {
    [key in 'zh' | 'vi' | 'ja' | 'th']: string;
  };
}

export type QuestionType = 
  | 'multipleChoice'
  | 'fillInBlank'
  | 'pronunciation'
  | 'speaking'
  | 'writing'
  | 'listening'
  | 'grammarCorrection'
  | 'translation';

export interface QuestionContent {
  text: string;
  audio?: string;
  image?: string;
  options?: string[];
  context?: string;
  hints?: string[];
}

export interface AssessmentResult {
  userId: string;
  assessmentId: string;
  score: number;
  answers: Answer[];
  duration: number;
  completedAt: Date;
  feedback: Feedback[];
}

export interface Answer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeTaken: number;
  attempts: number;
}

export interface Feedback {
  type: 'grammar' | 'pronunciation' | 'vocabulary' | 'structure';
  issue: string;
  correction: string;
  explanation: string;
  resources: string[];
}

export interface BilingualQuestion extends Question {
  content: BilingualQuestionContent;
  explanation: {
    [key in 'zh' | 'vi' | 'ja' | 'th']: {
      text: string;
      romanization?: string;
    };
  };
}

export interface BilingualQuestionContent extends QuestionContent {
  nativeText: string;
  romanization?: string;
  culturalContext?: string;
  grammarNotes?: {
    english: string;
    native: string;
  };
}

export interface BilingualFeedback extends Feedback {
  nativeExplanation: string;
  romanization?: string;
  culturalNotes?: string;
  commonErrors: {
    english: string;
    native: string;
    explanation: string;
  }[];
} 