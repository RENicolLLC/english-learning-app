import { UserProgress, LearningMetrics, PronunciationScore, LanguageSpecificChallenges } from '../types';

interface GameElements {
  streakDays: number;
  points: number;
  level: number;
  badges: string[];
}

interface PerformanceData {
  userId: string;
  timestamp: Date;
  category: 'pronunciation' | 'grammar' | 'vocabulary' | 'speaking' | 'listening';
  score: number;
  duration: number;
  nativeLanguage: 'zh' | 'vi' | 'ja' | 'th';
  gameElements?: GameElements;
  lessonType: 'practice' | 'quiz' | 'conversation' | 'pronunciation-drill';
  mistakePattern?: string[];
}

// Add engagement metrics
interface EngagementMetrics {
  dailyStreak: number;
  weeklyActivity: number;
  completionRate: number;
  socialInteractions: number;
  practiceTime: number;
}

const LANGUAGE_CHALLENGES: LanguageSpecificChallenges = {
  zh: {
    commonErrors: ['article-usage', 'plural-forms', 'verb-tense'],
    soundPairs: [['l', 'r'], ['th', 's'], ['v', 'w']],
    toneIssues: ['stress-patterns', 'intonation', 'word-stress']
  },
  vi: {
    commonErrors: ['plural-marking', 'article-usage', 'past-tense'],
    soundPairs: [['p', 'b'], ['t', 'd'], ['s', 'sh']],
    finalConsonants: ['p', 't', 'k', 'd']
  },
  ja: {
    commonErrors: ['article-usage', 'subject-pronoun', 'r-l-distinction'],
    soundPairs: [['r', 'l'], ['b', 'v'], ['s', 'th']],
    consonantClusters: ['str', 'spr', 'scr']
  },
  th: {
    commonErrors: ['subject-verb-agreement', 'article-usage', 'past-tense'],
    soundPairs: [['r', 'l'], ['v', 'w'], ['ch', 'sh']],
    finalStops: ['p', 't', 'k']
  }
};

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, Performance[]> = new Map();

  private constructor() {
    // Initialize performance observer
    if (typeof window !== 'undefined') {
      this.initializeObserver();
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObserver(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric(entry.entryType, {
          name: entry.name,
          duration: entry.duration,
          startTime: entry.startTime,
          timestamp: Date.now()
        });
      });
    });

    observer.observe({
      entryTypes: ['navigation', 'resource', 'paint', 'mark', 'measure']
    });
  }

  private recordMetric(type: string, data: Performance): void {
    if (!this.metrics.has(type)) {
      this.metrics.set(type, []);
    }
    this.metrics.get(type)?.push(data);

    // Keep only last 100 entries per type
    const entries = this.metrics.get(type);
    if (entries && entries.length > 100) {
      entries.shift();
    }
  }

  measureUserInteraction(componentId: string): void {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        this.recordMetric('interaction', {
          name: componentId,
          duration,
          startTime: start,
          timestamp: Date.now()
        });
      }
    };
  }

  getMetrics(type?: string): Performance[] | Map<string, Performance[]> {
    if (type) {
      return this.metrics.get(type) || [];
    }
    return this.metrics;
  }

  async reportMetrics(): Promise<void> {
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metrics: Object.fromEntries(this.metrics),
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      console.error('Failed to report metrics:', error);
    }
  }

  async trackProgress(data: PerformanceData): Promise<void> {
    try {
      await this.saveToDatabase(data);
      await this.analyzePerformance(data);
    } catch (error) {
      console.error('Error tracking progress:', error);
    }
  }

  async analyzePerformance(data: PerformanceData): Promise<LearningMetrics> {
    const metrics: LearningMetrics = {
      strengths: [],
      weaknesses: [],
      recommendations: [],
      nextLevelEstimate: 0
    };

    switch (data.category) {
      case 'pronunciation':
        return this.analyzePronunciation(data);
      case 'grammar':
        return this.analyzeGrammar(data);
      case 'vocabulary':
        return this.analyzeVocabulary(data);
      case 'speaking':
        return this.analyzeSpeaking(data);
      case 'listening':
        return this.analyzeListening(data);
      default:
        return metrics;
    }
  }

  private async analyzePronunciation(data: PerformanceData): Promise<LearningMetrics> {
    const languageSpecifics = LANGUAGE_CHALLENGES[data.nativeLanguage];
    const pronunciationScore: PronunciationScore = {
      accuracy: data.score,
      fluency: this.calculateFluency(data),
      problemSounds: this.identifyProblemSounds(data, languageSpecifics.soundPairs),
      recommendations: this.generateRecommendations(data.nativeLanguage, 'pronunciation')
    };

    // Add visual feedback like ELSA Speak
    const visualFeedback = await this.generatePronunciationVisuals(data);

    return {
      strengths: this.identifyStrengths(data),
      weaknesses: this.identifyWeaknesses(data),
      recommendations: pronunciationScore.recommendations,
      nextLevelEstimate: this.calculateNextLevel(data),
      pronunciationDetails: pronunciationScore,
      visualGuides: visualFeedback
    };
  }

  private async analyzeGrammar(data: PerformanceData): Promise<LearningMetrics> {
    const languageSpecifics = LANGUAGE_CHALLENGES[data.nativeLanguage];
    return {
      strengths: this.identifyStrengths(data),
      weaknesses: this.identifyWeaknesses(data),
      recommendations: this.generateRecommendations(data.nativeLanguage, 'grammar'),
      nextLevelEstimate: this.calculateNextLevel(data)
    };
  }

  private calculateFluency(data: PerformanceData): number {
    // Implementation for fluency calculation
    return 0;
  }

  private identifyProblemSounds(data: PerformanceData, soundPairs: string[][]): string[] {
    // Implementation for identifying problem sounds
    return [];
  }

  private generateRecommendations(nativeLanguage: string, category: string): string[] {
    // Implementation for generating recommendations
    return [];
  }

  private identifyStrengths(data: PerformanceData): string[] {
    // Implementation for identifying strengths
    return [];
  }

  private identifyWeaknesses(data: PerformanceData): string[] {
    // Implementation for identifying weaknesses
    return [];
  }

  private calculateNextLevel(data: PerformanceData): number {
    // Implementation for calculating next level
    return 0;
  }

  private async saveToDatabase(data: PerformanceData): Promise<void> {
    // Implementation for database storage
  }

  private async analyzeVocabulary(data: PerformanceData): Promise<LearningMetrics> {
    // Implement spaced repetition like Babbel
    const spacedRepetitionSchedule = this.calculateReviewSchedule(data);
    
    return {
      strengths: this.identifyStrengths(data),
      weaknesses: this.identifyWeaknesses(data),
      recommendations: this.generateRecommendations(data.nativeLanguage, 'vocabulary'),
      nextLevelEstimate: this.calculateNextLevel(data),
      reviewSchedule: spacedRepetitionSchedule
    };
  }

  private async analyzeSpeaking(data: PerformanceData): Promise<LearningMetrics> {
    // Implement conversation analysis like HelloTalk
    const conversationMetrics = await this.analyzeConversationSkills(data);
    
    return {
      strengths: this.identifyStrengths(data),
      weaknesses: this.identifyWeaknesses(data),
      recommendations: this.generateRecommendations(data.nativeLanguage, 'speaking'),
      nextLevelEstimate: this.calculateNextLevel(data),
      conversationMetrics
    };
  }

  private async analyzeListening(data: PerformanceData): Promise<LearningMetrics> {
    // Implement listening comprehension analysis
    const comprehensionScore = await this.analyzeComprehension(data);
    
    return {
      strengths: this.identifyStrengths(data),
      weaknesses: this.identifyWeaknesses(data),
      recommendations: this.generateRecommendations(data.nativeLanguage, 'listening'),
      nextLevelEstimate: this.calculateNextLevel(data),
      comprehensionScore
    };
  }

  private async calculateReviewSchedule(data: PerformanceData): Promise<any> {
    // Implement spaced repetition algorithm
    return {};
  }

  private async generatePronunciationVisuals(data: PerformanceData): Promise<any> {
    // Generate visual guides for pronunciation
    return {};
  }

  private async analyzeConversationSkills(data: PerformanceData): Promise<any> {
    // Analyze conversation fluency and naturalness
    return {};
  }

  private async analyzeComprehension(data: PerformanceData): Promise<any> {
    // Analyze listening comprehension
    return {};
  }

  private async updateGameElements(data: PerformanceData): Promise<GameElements> {
    // Update points, streaks, and badges like Duolingo
    return {
      streakDays: 0,
      points: 0,
      level: 0,
      badges: []
    };
  }
}

interface Performance {
  name: string;
  duration: number;
  startTime: number;
  timestamp: number;
} 