import { EnglishLevel } from './user';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: EnglishLevel;
  category: LessonCategory;
  type: LessonType;
  content: LessonContent;
  prerequisites: string[];
  estimatedTime: number; // in minutes
  points: number;
  order: number;
}

export enum LessonCategory {
  CONVERSATION = 'CONVERSATION',
  GRAMMAR = 'GRAMMAR',
  PRONUNCIATION = 'PRONUNCIATION',
  VOCABULARY = 'VOCABULARY',
  READING = 'READING',
  WRITING = 'WRITING',
  LISTENING = 'LISTENING',
  BUSINESS = 'BUSINESS'
}

export enum LessonType {
  TUTORIAL = 'TUTORIAL',
  PRACTICE = 'PRACTICE',
  QUIZ = 'QUIZ',
  SPEAKING = 'SPEAKING',
  INTERACTIVE = 'INTERACTIVE'
}

export interface LessonContent {
  sections: ContentSection[];
  exercises: Exercise[];
  examples: Example[];
  quiz?: Quiz;
}

export interface ContentSection {
  title: string;
  content: string;
  audioUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  translations: Record<string, string>;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  translations: Record<string, string>;
}

export enum ExerciseType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
  MATCHING = 'MATCHING',
  SPEAKING = 'SPEAKING',
  WRITING = 'WRITING',
  LISTENING = 'LISTENING',
  PRONUNCIATION = 'PRONUNCIATION'
}

export interface Example {
  english: string;
  translations: Record<string, string>;
  audioUrl?: string;
  imageUrl?: string;
  context?: string;
  usage?: string[];
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // in minutes
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation: string;
  translations: Record<string, string>;
}

export enum QuizQuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
  MATCHING = 'MATCHING',
  SPEAKING = 'SPEAKING',
  WRITING = 'WRITING'
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  level: EnglishLevel;
  lessons: Lesson[];
  order: number;
  requiredSubscription: SubscriptionTier;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: EnglishLevel;
  units: Unit[];
  category: LessonCategory;
  requiredSubscription: SubscriptionTier;
  imageUrl?: string;
  duration: number; // in hours
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  targetLevel: EnglishLevel;
  courses: Course[];
  requiredSubscription: SubscriptionTier;
  estimatedDuration: number; // in weeks
} 