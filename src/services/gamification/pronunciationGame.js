import { speechRecognitionService } from '../speech/speechRecognitionService';

// Game levels and progression
export const gameConfig = {
  levels: {
    beginner: {
      name: "Pronunciation Novice",
      requiredPoints: 0,
      challenges: ["basic-sounds", "simple-words"],
      rewards: {
        points: 10,
        badges: ["First Word", "Clear Speaker"]
      }
    },
    intermediate: {
      name: "Word Master",
      requiredPoints: 100,
      challenges: ["word-stress", "sentences"],
      rewards: {
        points: 20,
        badges: ["Stress Master", "Rhythm Expert"]
      }
    },
    advanced: {
      name: "Fluency Expert",
      requiredPoints: 300,
      challenges: ["conversations", "medical-terms"],
      rewards: {
        points: 30,
        badges: ["Medical Pro", "Perfect Accent"]
      }
    }
  },

  // Achievement system
  achievements: {
    perfectPronunciation: {
      name: "Perfect Pronunciation",
      description: "Score 100% on any word",
      points: 50,
      icon: "🎯"
    },
    dailyStreak: {
      name: "Practice Streak",
      description: "Practice 5 days in a row",
      points: 100,
      icon: "🔥"
    },
    vocabularyMaster: {
      name: "Vocabulary Master",
      description: "Learn 50 medical terms",
      points: 200,
      icon: "📚"
    },
    speedLearner: {
      name: "Speed Learner",
      description: "Complete 10 exercises in 10 minutes",
      points: 150,
      icon: "⚡"
    }
  },

  // Challenge types
  challenges: {
    wordChallenge: {
      type: "single_word",
      timeLimit: 30,
      attempts: 3,
      points: {
        perfect: 30,
        good: 20,
        fair: 10
      }
    },
    speedChallenge: {
      type: "rapid_words",
      timeLimit: 60,
      targetWords: 10,
      bonusPoints: 5 // per second remaining
    },
    accuracyChallenge: {
      type: "precision",
      minAccuracy: 0.9,
      bonusMultiplier: 1.5
    },
    streakChallenge: {
      type: "daily_streak",
      daysRequired: 5,
      bonusPoints: 100
    }
  },

  // Power-ups and boosters
  powerUps: {
    extraTime: {
      name: "Time Boost",
      effect: "Adds 30 seconds to time limit",
      cost: 50,
      icon: "⏰"
    },
    extraAttempts: {
      name: "Extra Try",
      effect: "Adds one more attempt",
      cost: 30,
      icon: "🎯"
    },
    scoreBooster: {
      name: "Score Multiplier",
      effect: "2x points for next exercise",
      cost: 100,
      icon: "✨"
    },
    hintHelper: {
      name: "Pronunciation Hint",
      effect: "Shows detailed pronunciation guide",
      cost: 20,
      icon: "💡"
    }
  }
};

// Game session manager
export class PronunciationGameSession {
  constructor(userId) {
    this.userId = userId;
    this.score = 0;
    this.streak = 0;
    this.level = 'beginner';
    this.activePowerUps = [];
    this.achievements = [];
  }

  // Start a new challenge
  startChallenge(challengeType) {
    const challenge = gameConfig.challenges[challengeType];
    return {
      ...challenge,
      startTime: Date.now(),
      activePowerUps: this.activePowerUps
    };
  }

  // Calculate score for a completed exercise
  calculateScore(accuracy, time, challengeType) {
    let score = 0;
    const challenge = gameConfig.challenges[challengeType];

    // Base score calculation
    if (accuracy >= 0.9) {
      score = challenge.points.perfect;
    } else if (accuracy >= 0.7) {
      score = challenge.points.good;
    } else {
      score = challenge.points.fair;
    }

    // Apply power-up multipliers
    this.activePowerUps.forEach(powerUp => {
      if (powerUp.type === 'scoreBooster') {
        score *= 2;
      }
    });

    // Time bonus
    if (challengeType === 'speedChallenge') {
      const timeRemaining = challenge.timeLimit - time;
      if (timeRemaining > 0) {
        score += timeRemaining * challenge.bonusPoints;
      }
    }

    return score;
  }

  // Update user progress
  updateProgress(score, accuracy) {
    this.score += score;
    this.streak += 1;

    // Check for level up
    this.checkLevelUp();

    // Check for achievements
    this.checkAchievements(score, accuracy);

    // Update daily streak
    this.updateDailyStreak();

    return {
      newScore: this.score,
      streak: this.streak,
      level: this.level,
      newAchievements: this.achievements
    };
  }

  // Check for level up
  checkLevelUp() {
    const levels = Object.entries(gameConfig.levels);
    for (let i = levels.length - 1; i >= 0; i--) {
      const [levelName, levelData] = levels[i];
      if (this.score >= levelData.requiredPoints) {
        this.level = levelName;
        break;
      }
    }
  }

  // Check for new achievements
  checkAchievements(score, accuracy) {
    const newAchievements = [];

    if (accuracy === 1) {
      newAchievements.push(gameConfig.achievements.perfectPronunciation);
    }

    if (this.streak === 5) {
      newAchievements.push(gameConfig.achievements.dailyStreak);
    }

    return newAchievements;
  }

  // Use a power-up
  usePowerUp(powerUpId) {
    const powerUp = gameConfig.powerUps[powerUpId];
    if (this.score >= powerUp.cost) {
      this.score -= powerUp.cost;
      this.activePowerUps.push({
        ...powerUp,
        expiresAt: Date.now() + 300000 // 5 minutes
      });
      return true;
    }
    return false;
  }

  // Get current stats
  getStats() {
    return {
      userId: this.userId,
      score: this.score,
      level: this.level,
      streak: this.streak,
      achievements: this.achievements,
      activePowerUps: this.activePowerUps
    };
  }
}

export default {
  gameConfig,
  PronunciationGameSession
}; 