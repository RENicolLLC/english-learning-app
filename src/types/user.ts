import { SubscriptionTier } from './subscription';

export enum SubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  UNLIMITED = 'UNLIMITED'
}

export enum EnglishLevel {
  BEGINNER = 'BEGINNER',
  ELEMENTARY = 'ELEMENTARY',
  INTERMEDIATE = 'INTERMEDIATE',
  UPPER_INTERMEDIATE = 'UPPER_INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nativeLanguage: string;
  englishLevel: EnglishLevel;
  subscriptionTier: SubscriptionTier;
  createdAt: Date;
  lastLogin: Date;
  dailyLessonsCompleted: number;
  dailyLessonsLimit: number;
  streak: number;
  totalLessonsCompleted: number;
}

export interface UserProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  timeSpent: number;
  completedAt: Date;
  pronunciationAccuracy: number;
  mistakesMade: string[];
  strengths: string[];
  weaknesses: string[];
} 