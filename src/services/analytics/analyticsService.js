import { errorReportingService, DataSyncError } from '../error/errorReportingService';

class AnalyticsService {
  constructor() {
    this.eventQueue = [];
    this.isProcessing = false;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    this.offlineStorage = new Map();
    this.initialized = false;
  }

  async initialize() {
    try {
      if (this.initialized) return;

      // Initialize analytics providers
      await this.initializeProviders();
      
      // Process any stored offline events
      await this.processOfflineEvents();
      
      this.initialized = true;
    } catch (error) {
      this.handleError(error, { action: 'initialize' });
      // Continue without initialization, will work in offline mode
    }
  }

  async initializeProviders() {
    try {
      // Initialize Firebase Analytics
      if (window.firebase?.analytics) {
        this.firebaseAnalytics = window.firebase.analytics();
      }

      // Initialize Google Analytics
      if (window.gtag) {
        this.gtag = window.gtag;
      }

      // Initialize Custom Analytics
      await this.initializeCustomAnalytics();
    } catch (error) {
      throw new Error('Failed to initialize analytics providers: ' + error.message);
    }
  }

  async trackEvent(eventName, eventData = {}) {
    try {
      // Validate event data
      this.validateEventData(eventName, eventData);

      // Add to queue
      this.queueEvent({
        name: eventName,
        data: eventData,
        timestamp: new Date().toISOString()
      });

      // Process queue if not already processing
      if (!this.isProcessing) {
        await this.processEventQueue();
      }
    } catch (error) {
      this.handleError(error, {
        action: 'trackEvent',
        eventName,
        eventData
      });
    }
  }

  validateEventData(eventName, eventData) {
    if (!eventName || typeof eventName !== 'string') {
      throw new Error('Invalid event name');
    }

    if (eventData && typeof eventData !== 'object') {
      throw new Error('Event data must be an object');
    }

    // Validate event name format
    const validEventNameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,50}$/;
    if (!validEventNameRegex.test(eventName)) {
      throw new Error('Invalid event name format');
    }

    // Validate data values
    for (const [key, value] of Object.entries(eventData)) {
      if (value === undefined || value === null) {
        throw new Error(`Invalid value for key: ${key}`);
      }
      if (typeof value === 'object' && Object.keys(value).length === 0) {
        throw new Error(`Empty object for key: ${key}`);
      }
    }
  }

  queueEvent(event) {
    this.eventQueue.push(event);
  }

  async processEventQueue() {
    if (this.isProcessing || this.eventQueue.length === 0) return;

    this.isProcessing = true;
    let retryCount = 0;

    while (this.eventQueue.length > 0 && retryCount < this.retryAttempts) {
      try {
        const event = this.eventQueue[0];
        
        // Try to send to all providers
        await Promise.all([
          this.sendToFirebase(event),
          this.sendToGoogleAnalytics(event),
          this.sendToCustomAnalytics(event)
        ]);

        // Remove successfully processed event
        this.eventQueue.shift();
        retryCount = 0; // Reset retry count for next event
      } catch (error) {
        retryCount++;
        if (retryCount === this.retryAttempts) {
          // Store failed event for offline processing
          await this.storeOfflineEvent(this.eventQueue[0]);
          this.eventQueue.shift();
          retryCount = 0;
        } else {
          await this.delay(this.retryDelay * retryCount);
        }
      }
    }

    this.isProcessing = false;
  }

  async sendToFirebase(event) {
    if (!this.firebaseAnalytics) return;

    try {
      await this.firebaseAnalytics.logEvent(event.name, {
        ...event.data,
        timestamp: event.timestamp
      });
    } catch (error) {
      throw new DataSyncError(
        'firebase',
        'Failed to send event to Firebase',
        { originalError: error.message }
      );
    }
  }

  async sendToGoogleAnalytics(event) {
    if (!this.gtag) return;

    try {
      this.gtag('event', event.name, {
        ...event.data,
        timestamp: event.timestamp
      });
    } catch (error) {
      throw new DataSyncError(
        'google_analytics',
        'Failed to send event to Google Analytics',
        { originalError: error.message }
      );
    }
  }

  async sendToCustomAnalytics(event) {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      throw new DataSyncError(
        'custom_analytics',
        'Failed to send event to custom analytics',
        { originalError: error.message }
      );
    }
  }

  async storeOfflineEvent(event) {
    try {
      const key = `offline_event_${Date.now()}`;
      this.offlineStorage.set(key, event);
      
      // Also store in localStorage for persistence
      const offlineEvents = JSON.parse(localStorage.getItem('offline_analytics') || '[]');
      offlineEvents.push(event);
      localStorage.setItem('offline_analytics', JSON.stringify(offlineEvents));
    } catch (error) {
      this.handleError(error, {
        action: 'storeOfflineEvent',
        event
      });
    }
  }

  async processOfflineEvents() {
    try {
      // Process events from localStorage
      const offlineEvents = JSON.parse(localStorage.getItem('offline_analytics') || '[]');
      
      if (offlineEvents.length === 0) return;

      for (const event of offlineEvents) {
        await this.trackEvent(event.name, event.data);
      }

      // Clear processed events
      localStorage.removeItem('offline_analytics');
      this.offlineStorage.clear();
    } catch (error) {
      this.handleError(error, {
        action: 'processOfflineEvents'
      });
    }
  }

  handleError(error, context = {}) {
    errorReportingService.reportError(error, null, {
      component: 'AnalyticsService',
      ...context
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility methods
  async getEventStats(timeRange = '24h') {
    try {
      const response = await fetch(`/api/analytics/stats?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleError(error, {
        action: 'getEventStats',
        timeRange
      });
      return null;
    }
  }

  async getUserActivity(userId, startDate, endDate) {
    try {
      const response = await fetch(
        `/api/analytics/user/${userId}/activity?start=${startDate}&end=${endDate}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleError(error, {
        action: 'getUserActivity',
        userId,
        startDate,
        endDate
      });
      return [];
    }
  }

  clearOfflineStorage() {
    localStorage.removeItem('offline_analytics');
    this.offlineStorage.clear();
  }
}

export const analyticsService = new AnalyticsService(); 