import { errorReportingService, DataSyncError, ValidationError } from '../error/errorReportingService';

class UserSettingsService {
  constructor() {
    this.localStorageKey = 'user_settings';
    this.defaultSettings = {
      language: 'en',
      theme: 'light',
      notifications: true,
      soundEnabled: true,
      autoSave: true,
      difficulty: 'medium',
      practiceReminders: true,
      dailyGoal: 30, // minutes
      preferredVoice: 'default',
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reducedMotion: false
      }
    };
    this.pendingChanges = new Map();
    this.syncInterval = null;
  }

  async initialize(userId) {
    try {
      // Load settings from local storage
      const localSettings = this.getLocalSettings(userId);
      
      // If no local settings, fetch from server
      if (!localSettings) {
        const serverSettings = await this.fetchSettingsFromServer(userId);
        await this.saveLocalSettings(userId, serverSettings);
        return serverSettings;
      }

      // If local settings exist but aren't synced, sync with server
      if (!localSettings.synced) {
        await this.syncSettings(userId, localSettings);
      }

      return localSettings;
    } catch (error) {
      this.handleError(error, { userId, action: 'initialize' });
      return this.defaultSettings;
    }
  }

  async updateSettings(userId, newSettings) {
    try {
      // Validate settings
      this.validateSettings(newSettings);

      // Save locally first
      await this.saveLocalSettings(userId, {
        ...this.getLocalSettings(userId),
        ...newSettings,
        synced: false
      });

      // Queue for sync
      this.queueSettingsSync(userId, newSettings);

      return true;
    } catch (error) {
      this.handleError(error, {
        userId,
        action: 'update',
        settings: newSettings
      });
      throw error;
    }
  }

  validateSettings(settings) {
    // Validate language
    if (settings.language && !['en', 'es', 'fr', 'de', 'it', 'pt'].includes(settings.language)) {
      throw new ValidationError('Invalid language setting');
    }

    // Validate theme
    if (settings.theme && !['light', 'dark', 'system'].includes(settings.theme)) {
      throw new ValidationError('Invalid theme setting');
    }

    // Validate difficulty
    if (settings.difficulty && !['easy', 'medium', 'hard'].includes(settings.difficulty)) {
      throw new ValidationError('Invalid difficulty setting');
    }

    // Validate daily goal
    if (settings.dailyGoal && (typeof settings.dailyGoal !== 'number' || settings.dailyGoal < 5 || settings.dailyGoal > 240)) {
      throw new ValidationError('Invalid daily goal setting (must be between 5 and 240 minutes)');
    }

    // Validate accessibility settings
    if (settings.accessibility) {
      if (settings.accessibility.fontSize && !['small', 'medium', 'large'].includes(settings.accessibility.fontSize)) {
        throw new ValidationError('Invalid font size setting');
      }
    }
  }

  getLocalSettings(userId) {
    try {
      const key = `${this.localStorageKey}_${userId}`;
      const settings = localStorage.getItem(key);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      throw new DataSyncError(
        'local_storage',
        'Failed to read local settings',
        { originalError: error.message }
      );
    }
  }

  async saveLocalSettings(userId, settings) {
    try {
      const key = `${this.localStorageKey}_${userId}`;
      localStorage.setItem(key, JSON.stringify({
        ...settings,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      throw new DataSyncError(
        'local_storage',
        'Failed to save local settings',
        { originalError: error.message }
      );
    }
  }

  queueSettingsSync(userId, settings) {
    // Add to pending changes
    this.pendingChanges.set(userId, {
      settings,
      timestamp: new Date().toISOString()
    });

    // Start sync interval if not already running
    if (!this.syncInterval) {
      this.syncInterval = setInterval(() => {
        this.processPendingChanges();
      }, 5000); // Sync every 5 seconds
    }
  }

  async processPendingChanges() {
    if (this.pendingChanges.size === 0) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      return;
    }

    for (const [userId, data] of this.pendingChanges) {
      try {
        await this.syncSettings(userId, data.settings);
        this.pendingChanges.delete(userId);
      } catch (error) {
        this.handleError(error, {
          userId,
          action: 'sync',
          settings: data.settings
        });
      }
    }
  }

  async syncSettings(userId, settings) {
    try {
      const response = await fetch(`/api/users/${userId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local settings with synced status
      await this.saveLocalSettings(userId, {
        ...settings,
        synced: true,
        lastSynced: new Date().toISOString()
      });

      return true;
    } catch (error) {
      throw new DataSyncError(
        'server_sync',
        'Failed to sync settings with server',
        { originalError: error.message }
      );
    }
  }

  async fetchSettingsFromServer(userId) {
    try {
      const response = await fetch(`/api/users/${userId}/settings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new DataSyncError(
        'server_fetch',
        'Failed to fetch settings from server',
        { originalError: error.message }
      );
    }
  }

  handleError(error, context = {}) {
    errorReportingService.reportError(error, null, {
      component: 'UserSettingsService',
      ...context
    });
  }

  // Reset settings to default
  async resetSettings(userId) {
    try {
      await this.updateSettings(userId, this.defaultSettings);
      return true;
    } catch (error) {
      this.handleError(error, {
        userId,
        action: 'reset'
      });
      throw error;
    }
  }

  // Clear local settings
  clearLocalSettings(userId) {
    const key = `${this.localStorageKey}_${userId}`;
    localStorage.removeItem(key);
  }

  // Force sync settings
  async forceSyncSettings(userId) {
    const localSettings = this.getLocalSettings(userId);
    if (localSettings && !localSettings.synced) {
      await this.syncSettings(userId, localSettings);
    }
  }
}

export const userSettingsService = new UserSettingsService(); 