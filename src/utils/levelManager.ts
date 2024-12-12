import { LevelStructure, LEVEL_SYSTEM } from '../types/levels';
import { SubscriptionTier, SUBSCRIPTION_PLANS } from '../types/subscription';
import { DatabaseService } from '../services/database';

export class LevelManager {
  private static instance: LevelManager;
  private readonly MAX_LEVEL = 12;
  private db: DatabaseService;

  private constructor() {
    this.db = DatabaseService.getInstance();
  }

  static getInstance(): LevelManager {
    if (!LevelManager.instance) {
      LevelManager.instance = new LevelManager();
    }
    return LevelManager.instance;
  }

  async getUserLevel(userId: string): Promise<number> {
    // Get user's current level from database
    return 1;
  }

  async canAccessContent(
    userId: string,
    subscriptionTier: SubscriptionTier,
    contentId: string
  ): Promise<boolean> {
    const userLevel = await this.getUserLevel(userId);
    const dailyUsage = await this.getDailyUsage(userId);
    
    return this.checkAccessRights(subscriptionTier, userLevel, dailyUsage);
  }

  private async checkAccessRights(
    tier: SubscriptionTier,
    level: number,
    dailyUsage: number
  ): Promise<boolean> {
    const limits = {
      basic: { maxLevel: 4, dailyLessons: 3 },
      premium: { maxLevel: 8, dailyLessons: 10 },
      unlimited: { maxLevel: 12, dailyLessons: Infinity }
    };

    const tierLimits = limits[tier];
    return level <= tierLimits.maxLevel && dailyUsage < tierLimits.dailyLessons;
  }

  async assessLevelUp(userId: string, assessmentResults: {
    quiz: number;
    speaking: number;
    writing?: number;
    comprehensive?: number;
  }): Promise<{
    leveledUp: boolean;
    newLevel?: number;
    feedback: string[];
  }> {
    const currentLevel = await this.getUserLevel(userId);
    const levelRequirements = LEVEL_SYSTEM[currentLevel - 1];
    const feedback: string[] = [];

    // Check if user meets minimum requirements
    const meetsQuizRequirement = assessmentResults.quiz >= levelRequirements.assessments[0].passingScore;
    const meetsSpeakingRequirement = assessmentResults.speaking >= levelRequirements.assessments[1].passingScore;
    
    if (!meetsQuizRequirement) {
      feedback.push(`Quiz score (${assessmentResults.quiz}%) below required ${levelRequirements.assessments[0].passingScore}%`);
    }

    if (!meetsSpeakingRequirement) {
      feedback.push(`Speaking score (${assessmentResults.speaking}%) below required ${levelRequirements.assessments[1].passingScore}%`);
    }

    // Check additional requirements based on level
    const completedScenarios = await this.getCompletedScenarios(userId);
    if (completedScenarios < levelRequirements.requirements.completedScenarios) {
      feedback.push(`Need to complete ${levelRequirements.requirements.completedScenarios - completedScenarios} more scenarios`);
    }

    const canLevelUp = meetsQuizRequirement && 
                      meetsSpeakingRequirement && 
                      completedScenarios >= levelRequirements.requirements.completedScenarios;

    if (canLevelUp) {
      const newLevel = currentLevel + 1;
      await this.updateUserLevel(userId, newLevel);
      await this.unlockNewContent(userId, newLevel);
      
      feedback.push(`Congratulations! You've advanced to Level ${newLevel}!`);
      feedback.push(`New content unlocked: ${LEVEL_SYSTEM[newLevel - 1].name}`);

      return {
        leveledUp: true,
        newLevel,
        feedback
      };
    }

    return {
      leveledUp: false,
      feedback
    };
  }

  private async getCompletedScenarios(userId: string): Promise<number> {
    return await this.db.getUserCompletedScenarios(userId);
  }

  private async updateUserLevel(userId: string, newLevel: number): Promise<void> {
    await this.db.updateUserLevel(userId, newLevel);
  }

  private async unlockNewContent(userId: string, level: number): Promise<void> {
    const newContent = LEVEL_SYSTEM[level - 1].content;
    await this.db.unlockContentForUser(userId, newContent);
  }

  async getDailyProgress(userId: string): Promise<{
    lessonsCompleted: number;
    timeSpent: number;
    accuracyRate: number;
    streakDays: number;
  }> {
    const progress = await this.db.getUserDailyProgress(userId);
    return {
      lessonsCompleted: progress.lessons || 0,
      timeSpent: progress.minutes || 0,
      accuracyRate: progress.accuracy || 0,
      streakDays: progress.streak || 0
    };
  }

  async updateDailyUsage(userId: string, activityType: string, duration: number): Promise<void> {
    const currentUsage = await this.getDailyUsage(userId);
    const subscription = await this.db.getUserSubscription(userId);
    const limits = SUBSCRIPTION_PLANS[subscription.tier].features;

    if (currentUsage < limits.dailyLessons) {
      await this.db.updateDailyUsage(userId, {
        lessons: currentUsage + 1,
        duration,
        activityType
      });
    }
  }

  private async getDailyUsage(userId: string): Promise<number> {
    // Get user's daily usage count from database
    return 0;
  }
} 