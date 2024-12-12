import { errorReportingService, ValidationError, DataSyncError } from '../error/errorReportingService';

class ScoringService {
  constructor() {
    this.localStorageKey = 'user_scores';
    this.scoreTypes = {
      PRONUNCIATION: 'pronunciation',
      VOCABULARY: 'vocabulary',
      GRAMMAR: 'grammar',
      CONVERSATION: 'conversation',
      SCENARIO: 'scenario'
    };
    this.scoreQueue = [];
    this.isProcessing = false;
  }

  async calculateScore(type, data) {
    try {
      // Validate input
      this.validateScoreInput(type, data);

      // Calculate base score
      let score = await this.getBaseScore(type, data);

      // Apply modifiers
      score = this.applyModifiers(type, score, data);

      // Normalize score
      score = this.normalizeScore(score);

      return score;
    } catch (error) {
      this.handleError(error, {
        action: 'calculate',
        type,
        data
      });
      throw error;
    }
  }

  validateScoreInput(type, data) {
    if (!Object.values(this.scoreTypes).includes(type)) {
      throw new ValidationError(
        'Invalid score type',
        { type, validTypes: Object.values(this.scoreTypes) }
      );
    }

    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid score data');
    }

    switch (type) {
      case this.scoreTypes.PRONUNCIATION:
        if (!data.accuracy || typeof data.accuracy !== 'number') {
          throw new ValidationError('Missing pronunciation accuracy');
        }
        if (!data.fluency || typeof data.fluency !== 'number') {
          throw new ValidationError('Missing pronunciation fluency');
        }
        break;

      case this.scoreTypes.VOCABULARY:
        if (!Array.isArray(data.words)) {
          throw new ValidationError('Invalid vocabulary data format');
        }
        break;

      case this.scoreTypes.GRAMMAR:
        if (typeof data.correctAnswers !== 'number') {
          throw new ValidationError('Missing correct answers count');
        }
        if (typeof data.totalQuestions !== 'number') {
          throw new ValidationError('Missing total questions count');
        }
        break;

      case this.scoreTypes.CONVERSATION:
        if (!data.responses || !Array.isArray(data.responses)) {
          throw new ValidationError('Invalid conversation responses');
        }
        break;

      case this.scoreTypes.SCENARIO:
        if (!data.completedSteps || typeof data.completedSteps !== 'number') {
          throw new ValidationError('Missing completed steps count');
        }
        if (!data.totalSteps || typeof data.totalSteps !== 'number') {
          throw new ValidationError('Missing total steps count');
        }
        break;
    }
  }

  async getBaseScore(type, data) {
    switch (type) {
      case this.scoreTypes.PRONUNCIATION:
        return (data.accuracy * 0.6 + data.fluency * 0.4) * 100;

      case this.scoreTypes.VOCABULARY:
        return (data.words.filter(w => w.correct).length / data.words.length) * 100;

      case this.scoreTypes.GRAMMAR:
        return (data.correctAnswers / data.totalQuestions) * 100;

      case this.scoreTypes.CONVERSATION:
        return this.calculateConversationScore(data.responses);

      case this.scoreTypes.SCENARIO:
        return (data.completedSteps / data.totalSteps) * 100;

      default:
        throw new ValidationError('Unsupported score type');
    }
  }

  calculateConversationScore(responses) {
    let totalScore = 0;
    const weights = {
      accuracy: 0.4,
      relevance: 0.3,
      fluency: 0.3
    };

    responses.forEach(response => {
      const responseScore = 
        response.accuracy * weights.accuracy +
        response.relevance * weights.relevance +
        response.fluency * weights.fluency;
      totalScore += responseScore;
    });

    return (totalScore / responses.length) * 100;
  }

  applyModifiers(type, score, data) {
    // Apply difficulty modifier
    if (data.difficulty) {
      score *= this.getDifficultyModifier(data.difficulty);
    }

    // Apply streak bonus
    if (data.streak && data.streak > 1) {
      score *= (1 + (Math.min(data.streak, 10) - 1) * 0.05);
    }

    // Apply time bonus
    if (data.timeBonus) {
      score *= (1 + Math.min(data.timeBonus, 0.2));
    }

    return score;
  }

  getDifficultyModifier(difficulty) {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 0.8;
      case 'medium': return 1.0;
      case 'hard': return 1.2;
      default: return 1.0;
    }
  }

  normalizeScore(score) {
    // Ensure score is between 0 and 100
    return Math.min(Math.max(Math.round(score), 0), 100);
  }

  async saveScore(userId, type, score, metadata = {}) {
    try {
      // Save locally first
      await this.saveLocalScore(userId, type, score, metadata);

      // Queue for sync
      this.queueScore(userId, type, score, metadata);

      return true;
    } catch (error) {
      this.handleError(error, {
        action: 'save',
        userId,
        type,
        score,
        metadata
      });
      throw error;
    }
  }

  async saveLocalScore(userId, type, score, metadata) {
    try {
      const key = `${this.localStorageKey}_${userId}`;
      let scores = JSON.parse(localStorage.getItem(key) || '{}');
      
      scores = {
        ...scores,
        [type]: {
          score,
          metadata,
          timestamp: new Date().toISOString(),
          synced: false
        }
      };

      localStorage.setItem(key, JSON.stringify(scores));
    } catch (error) {
      throw new DataSyncError(
        'local_storage',
        'Failed to save score locally',
        { originalError: error.message }
      );
    }
  }

  queueScore(userId, type, score, metadata) {
    this.scoreQueue.push({
      userId,
      type,
      score,
      metadata,
      timestamp: new Date().toISOString()
    });

    if (!this.isProcessing) {
      this.processScoreQueue();
    }
  }

  async processScoreQueue() {
    if (this.isProcessing || this.scoreQueue.length === 0) return;

    this.isProcessing = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    while (this.scoreQueue.length > 0 && retryCount < MAX_RETRIES) {
      try {
        const scoreData = this.scoreQueue[0];
        await this.syncScore(scoreData);
        this.scoreQueue.shift(); // Remove processed score
        retryCount = 0; // Reset retry count for next score
      } catch (error) {
        retryCount++;
        if (retryCount === MAX_RETRIES) {
          // Log error and remove failed score after max retries
          this.handleError(error, {
            action: 'sync',
            scoreData: this.scoreQueue[0]
          });
          this.scoreQueue.shift();
          retryCount = 0;
        } else {
          await this.delay(1000 * retryCount);
        }
      }
    }

    this.isProcessing = false;
  }

  async syncScore(scoreData) {
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local storage sync status
      await this.updateSyncStatus(
        scoreData.userId,
        scoreData.type,
        true
      );

      return true;
    } catch (error) {
      throw new DataSyncError(
        'server_sync',
        'Failed to sync score with server',
        { originalError: error.message }
      );
    }
  }

  async updateSyncStatus(userId, type, synced) {
    const key = `${this.localStorageKey}_${userId}`;
    let scores = JSON.parse(localStorage.getItem(key) || '{}');
    
    if (scores[type]) {
      scores[type].synced = synced;
      scores[type].lastSynced = synced ? new Date().toISOString() : null;
      localStorage.setItem(key, JSON.stringify(scores));
    }
  }

  handleError(error, context = {}) {
    errorReportingService.reportError(error, null, {
      component: 'ScoringService',
      ...context
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility methods
  async getHighScore(userId, type) {
    try {
      const response = await fetch(`/api/scores/${userId}/${type}/high`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleError(error, {
        action: 'getHighScore',
        userId,
        type
      });
      return null;
    }
  }

  async getScoreHistory(userId, type, limit = 10) {
    try {
      const response = await fetch(
        `/api/scores/${userId}/${type}/history?limit=${limit}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleError(error, {
        action: 'getScoreHistory',
        userId,
        type,
        limit
      });
      return [];
    }
  }

  clearLocalScores(userId) {
    const key = `${this.localStorageKey}_${userId}`;
    localStorage.removeItem(key);
  }
}

export const scoringService = new ScoringService(); 