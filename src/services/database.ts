import { Pool, QueryResult } from 'pg';
import { LevelContent } from '../types/levels';
import { SubscriptionTier } from '../types/subscription';

export class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432'),
      ssl: process.env.NODE_ENV === 'production'
    });
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // User Management
  async createUser(userData: {
    email: string;
    password: string;
    nativeLanguage: string;
    name: string;
  }): Promise<string> {
    const query = `
      INSERT INTO users (email, password_hash, native_language, name, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING user_id
    `;
    const result = await this.pool.query(query, [
      userData.email,
      userData.password, // Note: Should be hashed before storage
      userData.nativeLanguage,
      userData.name
    ]);
    return result.rows[0].user_id;
  }

  // Level Management
  async getUserLevel(userId: string): Promise<number> {
    const query = 'SELECT current_level FROM user_progress WHERE user_id = $1';
    const result = await this.pool.query(query, [userId]);
    return result.rows[0]?.current_level || 1;
  }

  async updateUserLevel(userId: string, newLevel: number): Promise<void> {
    const query = `
      INSERT INTO user_progress (user_id, current_level, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET current_level = $2, updated_at = NOW()
    `;
    await this.pool.query(query, [userId, newLevel]);
  }

  // Progress Tracking
  async getUserCompletedScenarios(userId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as completed
      FROM user_scenario_progress
      WHERE user_id = $1 AND completion_status = 'completed'
    `;
    const result = await this.pool.query(query, [userId]);
    return parseInt(result.rows[0].completed);
  }

  async getUserDailyProgress(userId: string): Promise<{
    lessons: number;
    minutes: number;
    accuracy: number;
    streak: number;
  }> {
    const query = `
      SELECT 
        COUNT(DISTINCT lesson_id) as lessons,
        SUM(duration) as minutes,
        AVG(accuracy) as accuracy,
        streak_days as streak
      FROM user_daily_progress
      WHERE user_id = $1 
      AND date = CURRENT_DATE
      GROUP BY streak_days
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows[0] || { lessons: 0, minutes: 0, accuracy: 0, streak: 0 };
  }

  // Content Management
  async unlockContentForUser(userId: string, content: LevelContent): Promise<void> {
    const query = `
      INSERT INTO user_content_access (user_id, content_id, unlocked_at)
      SELECT $1, c.content_id, NOW()
      FROM content c
      WHERE c.level = $2
      AND NOT EXISTS (
        SELECT 1 FROM user_content_access 
        WHERE user_id = $1 AND content_id = c.content_id
      )
    `;
    await this.pool.query(query, [userId, content]);
  }

  // Subscription Management
  async getUserSubscription(userId: string): Promise<{
    tier: SubscriptionTier;
    validUntil: Date;
  }> {
    const query = `
      SELECT tier, valid_until 
      FROM user_subscriptions 
      WHERE user_id = $1 AND valid_until > NOW()
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows[0];
  }

  // Usage Tracking
  async updateDailyUsage(userId: string, usage: {
    lessons: number;
    duration: number;
    activityType: string;
  }): Promise<void> {
    const query = `
      INSERT INTO user_daily_usage (user_id, date, lessons_completed, duration, activity_type)
      VALUES ($1, CURRENT_DATE, $2, $3, $4)
      ON CONFLICT (user_id, date) 
      DO UPDATE SET 
        lessons_completed = user_daily_usage.lessons_completed + $2,
        duration = user_daily_usage.duration + $3
    `;
    await this.pool.query(query, [
      userId,
      usage.lessons,
      usage.duration,
      usage.activityType
    ]);
  }

  // Performance Analytics
  async savePerformanceData(userId: string, data: {
    category: string;
    score: number;
    duration: number;
    mistakes: string[];
  }): Promise<void> {
    const query = `
      INSERT INTO performance_metrics (
        user_id, category, score, duration, mistakes, recorded_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
    `;
    await this.pool.query(query, [
      userId,
      data.category,
      data.score,
      data.duration,
      data.mistakes
    ]);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
} 