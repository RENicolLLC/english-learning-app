interface APIUsage {
  calls: number;
  bytesProcessed: number;
  lastReset: Date;
  quotaLimit: number;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresIn: number;
}

export class APIManager {
  private static instance: APIManager;
  private usage: APIUsage = {
    calls: 0,
    bytesProcessed: 0,
    lastReset: new Date(),
    quotaLimit: 60 * 60 * 1000 // 1 hour of audio in milliseconds
  };
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly QUOTA_RESET_INTERVAL = 30 * 24 * 60 * 60 * 1000; // 30 days

  private constructor() {
    this.loadUsageFromStorage();
    this.setupQuotaReset();
  }

  static getInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager();
    }
    return APIManager.instance;
  }

  async validateAPIKey(): Promise<boolean> {
    const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
    const projectId = import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID;

    if (!apiKey || !projectId) {
      throw new Error('Missing API credentials');
    }

    try {
      // Test API key with a minimal request
      const response = await fetch(
        `https://speech.googleapis.com/v1/projects/${projectId}/locations/global/operations?key=${apiKey}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        console.error('API key validation failed:', await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  }

  async trackUsage(audioLengthMs: number, bytesProcessed: number): Promise<boolean> {
    this.usage.calls++;
    this.usage.bytesProcessed += bytesProcessed;

    const remainingQuota = this.usage.quotaLimit - audioLengthMs;
    if (remainingQuota < 0) {
      throw new Error('API quota exceeded');
    }

    this.saveUsageToStorage();
    return true;
  }

  async getCachedResult(key: string): Promise<any | null> {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  async cacheResult(key: string, data: any, customExpiration?: number): Promise<void> {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: customExpiration || this.CACHE_DURATION
    });

    // Persist cache to localStorage
    this.saveCacheToStorage();
  }

  getUsageStats(): APIUsage {
    return { ...this.usage };
  }

  getRemainingQuota(): number {
    return this.usage.quotaLimit - this.usage.calls;
  }

  private loadUsageFromStorage(): void {
    try {
      const savedUsage = localStorage.getItem('api_usage');
      if (savedUsage) {
        this.usage = JSON.parse(savedUsage);
        this.usage.lastReset = new Date(this.usage.lastReset);
      }

      const savedCache = localStorage.getItem('api_cache');
      if (savedCache) {
        const cacheData = JSON.parse(savedCache);
        this.cache = new Map(Object.entries(cacheData));
      }
    } catch (error) {
      console.error('Error loading API usage data:', error);
    }
  }

  private saveUsageToStorage(): void {
    try {
      localStorage.setItem('api_usage', JSON.stringify(this.usage));
    } catch (error) {
      console.error('Error saving API usage data:', error);
    }
  }

  private saveCacheToStorage(): void {
    try {
      const cacheData = Object.fromEntries(this.cache);
      localStorage.setItem('api_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving cache data:', error);
    }
  }

  private setupQuotaReset(): void {
    setInterval(() => {
      const now = new Date();
      if (now.getTime() - this.usage.lastReset.getTime() >= this.QUOTA_RESET_INTERVAL) {
        this.usage = {
          calls: 0,
          bytesProcessed: 0,
          lastReset: now,
          quotaLimit: this.usage.quotaLimit
        };
        this.saveUsageToStorage();
      }
    }, 24 * 60 * 60 * 1000); // Check daily
  }
} 