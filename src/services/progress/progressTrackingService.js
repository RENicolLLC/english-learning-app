import { errorReportingService, DataSyncError, ValidationError } from '../error/errorReportingService';

class ProgressTrackingService {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    this.localStorageKey = 'user_progress_cache';
    this.syncQueue = [];
    this.isSyncing = false;
  }

  async trackProgress(userId, activityType, progress) {
    try {
      // Validate progress data
      this.validateProgressData(activityType, progress);

      // Save locally first
      await this.saveToLocalStorage(userId, activityType, progress);

      // Then sync with server
      await this.syncProgress(userId, activityType, progress);

      return true;
    } catch (error) {
      this.handleError(error, {
        userId,
        activityType,
        progress
      });
      throw error;
    }
  }

  validateProgressData(activityType, progress) {
    if (!activityType) {
      throw new ValidationError('Missing activity type');
    }

    const validActivityTypes = [
      'pronunciation',
      'vocabulary',
      'grammar',
      'conversation',
      'scenario'
    ];

    if (!validActivityTypes.includes(activityType)) {
      throw new ValidationError(`Invalid activity type: ${activityType}`);
    }

    if (!progress || typeof progress !== 'object') {
      throw new ValidationError('Invalid progress data');
    }

    // Validate required fields based on activity type
    switch (activityType) {
      case 'pronunciation':
        if (!progress.score || typeof progress.score !== 'number') {
          throw new ValidationError('Invalid pronunciation score');
        }
        break;
      case 'vocabulary':
        if (!Array.isArray(progress.words)) {
          throw new ValidationError('Invalid vocabulary progress');
        }
        break;
      case 'grammar':
        if (!progress.exerciseId || !progress.correct) {
          throw new ValidationError('Invalid grammar progress');
        }
        break;
      case 'conversation':
        if (!progress.dialogueId || !progress.completed) {
          throw new ValidationError('Invalid conversation progress');
        }
        break;
      case 'scenario':
        if (!progress.scenarioId || !progress.steps) {
          throw new ValidationError('Invalid scenario progress');
        }
        break;
    }
  }

  async saveToLocalStorage(userId, activityType, progress) {
    try {
      const key = `${this.localStorageKey}_${userId}`;
      let userData = JSON.parse(localStorage.getItem(key) || '{}');
      
      userData = {
        ...userData,
        [activityType]: {
          ...userData[activityType],
          ...progress,
          lastUpdated: new Date().toISOString(),
          synced: false
        }
      };

      localStorage.setItem(key, JSON.stringify(userData));
    } catch (error) {
      throw new DataSyncError(
        'local_storage',
        'Failed to save progress locally',
        { originalError: error.message }
      );
    }
  }

  async syncProgress(userId, activityType, progress) {
    // Add to sync queue
    this.syncQueue.push({
      userId,
      activityType,
      progress,
      timestamp: new Date().toISOString()
    });

    // Start sync process if not already running
    if (!this.isSyncing) {
      await this.processSyncQueue();
    }
  }

  async processSyncQueue() {
    if (this.isSyncing || this.syncQueue.length === 0) return;

    this.isSyncing = true;
    let attempts = 0;

    while (this.syncQueue.length > 0 && attempts < this.retryAttempts) {
      try {
        const item = this.syncQueue[0];
        await this.sendProgressToServer(item);
        
        // Update local storage sync status
        await this.updateSyncStatus(item.userId, item.activityType, true);
        
        // Remove from queue if successful
        this.syncQueue.shift();
        attempts = 0; // Reset attempts for next item
      } catch (error) {
        attempts++;
        if (attempts === this.retryAttempts) {
          // Report error but keep item in queue
          this.handleError(error, this.syncQueue[0]);
          this.syncQueue.shift(); // Remove failed item
          attempts = 0; // Reset for next item
        } else {
          await this.delay(this.retryDelay * attempts);
        }
      }
    }

    this.isSyncing = false;
  }

  async sendProgressToServer(progressData) {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new DataSyncError(
        'server_sync',
        'Failed to sync progress with server',
        { originalError: error.message }
      );
    }
  }

  async updateSyncStatus(userId, activityType, synced) {
    const key = `${this.localStorageKey}_${userId}`;
    let userData = JSON.parse(localStorage.getItem(key) || '{}');
    
    if (userData[activityType]) {
      userData[activityType].synced = synced;
      userData[activityType].lastSynced = synced ? new Date().toISOString() : null;
      localStorage.setItem(key, JSON.stringify(userData));
    }
  }

  async getProgress(userId, activityType) {
    try {
      // Try to get from local storage first
      const localData = this.getLocalProgress(userId, activityType);
      
      // If not synced, try to sync with server
      if (localData && !localData.synced) {
        await this.syncProgress(userId, activityType, localData);
      }

      // If no local data or force refresh needed, get from server
      if (!localData) {
        return await this.getProgressFromServer(userId, activityType);
      }

      return localData;
    } catch (error) {
      this.handleError(error, { userId, activityType });
      return null;
    }
  }

  getLocalProgress(userId, activityType) {
    const key = `${this.localStorageKey}_${userId}`;
    const userData = JSON.parse(localStorage.getItem(key) || '{}');
    return userData[activityType];
  }

  async getProgressFromServer(userId, activityType) {
    try {
      const response = await fetch(`/api/progress/${userId}/${activityType}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new DataSyncError(
        'server_fetch',
        'Failed to fetch progress from server',
        { originalError: error.message }
      );
    }
  }

  handleError(error, context = {}) {
    errorReportingService.reportError(error, null, {
      component: 'ProgressTrackingService',
      ...context
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Clear local progress data
  clearLocalProgress(userId) {
    const key = `${this.localStorageKey}_${userId}`;
    localStorage.removeItem(key);
  }

  // Force sync all unsynchronized progress
  async forceSyncAll(userId) {
    const key = `${this.localStorageKey}_${userId}`;
    const userData = JSON.parse(localStorage.getItem(key) || '{}');

    for (const [activityType, progress] of Object.entries(userData)) {
      if (!progress.synced) {
        await this.syncProgress(userId, activityType, progress);
      }
    }
  }
}

export const progressTrackingService = new ProgressTrackingService(); 