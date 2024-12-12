import { errorReportingService, ValidationError, DataSyncError } from '../error/errorReportingService';

class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.maxMemorySize = 100; // Maximum number of items in memory
    this.maxStorageSize = 5 * 1024 * 1024; // 5MB storage limit
    this.storagePrefix = 'app_cache_';
    this.initialized = false;
  }

  async initialize() {
    try {
      if (this.initialized) return;

      // Check storage availability
      this.checkStorageAvailability();
      
      // Clean up expired items
      await this.cleanupExpired();
      
      // Initialize cache size tracking
      await this.initializeSizeTracking();
      
      this.initialized = true;
    } catch (error) {
      this.handleError(error, { action: 'initialize' });
      // Continue with memory-only caching if storage is unavailable
    }
  }

  checkStorageAvailability() {
    try {
      const testKey = `${this.storagePrefix}test`;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      throw new Error('Local storage is not available');
    }
  }

  async set(key, value, options = {}) {
    try {
      this.validateKey(key);
      this.validateValue(value);
      this.validateOptions(options);

      const cacheItem = {
        value,
        timestamp: Date.now(),
        expiry: options.expiry ? Date.now() + options.expiry : null,
        version: options.version || 1,
        metadata: options.metadata || {}
      };

      // Set in memory cache
      this.setMemoryCache(key, cacheItem);

      // Set in persistent storage if enabled
      if (options.persistent) {
        await this.setPersistentCache(key, cacheItem);
      }

      return true;
    } catch (error) {
      this.handleError(error, {
        action: 'set',
        key,
        options
      });
      throw error;
    }
  }

  async get(key, options = {}) {
    try {
      this.validateKey(key);

      // Try memory cache first
      let cacheItem = this.getMemoryCache(key);

      // If not in memory and persistent storage is allowed, try localStorage
      if (!cacheItem && options.checkPersistent) {
        cacheItem = await this.getPersistentCache(key);
        if (cacheItem) {
          // Restore to memory cache
          this.setMemoryCache(key, cacheItem);
        }
      }

      if (!cacheItem) {
        return null;
      }

      // Check expiry
      if (this.isExpired(cacheItem)) {
        this.remove(key);
        return null;
      }

      // Check version
      if (options.version && cacheItem.version !== options.version) {
        this.remove(key);
        return null;
      }

      return cacheItem.value;
    } catch (error) {
      this.handleError(error, {
        action: 'get',
        key,
        options
      });
      return null;
    }
  }

  async remove(key) {
    try {
      this.validateKey(key);

      // Remove from memory
      this.memoryCache.delete(key);

      // Remove from persistent storage
      try {
        localStorage.removeItem(`${this.storagePrefix}${key}`);
      } catch (error) {
        // Ignore storage errors on removal
      }

      return true;
    } catch (error) {
      this.handleError(error, {
        action: 'remove',
        key
      });
      return false;
    }
  }

  validateKey(key) {
    if (!key || typeof key !== 'string') {
      throw new ValidationError('Invalid cache key');
    }

    if (key.length > 100) {
      throw new ValidationError('Cache key too long (max 100 characters)');
    }

    // Check for valid characters
    if (!/^[\w\-\.]+$/.test(key)) {
      throw new ValidationError('Cache key contains invalid characters');
    }
  }

  validateValue(value) {
    if (value === undefined) {
      throw new ValidationError('Cache value cannot be undefined');
    }

    try {
      JSON.stringify(value);
    } catch (error) {
      throw new ValidationError('Cache value must be JSON serializable');
    }
  }

  validateOptions(options) {
    if (options.expiry && (typeof options.expiry !== 'number' || options.expiry < 0)) {
      throw new ValidationError('Invalid expiry value');
    }

    if (options.version && typeof options.version !== 'number') {
      throw new ValidationError('Invalid version number');
    }

    if (options.metadata && typeof options.metadata !== 'object') {
      throw new ValidationError('Invalid metadata format');
    }
  }

  setMemoryCache(key, value) {
    // Implement LRU eviction if needed
    if (this.memoryCache.size >= this.maxMemorySize) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }

    this.memoryCache.set(key, value);
  }

  getMemoryCache(key) {
    return this.memoryCache.get(key);
  }

  async setPersistentCache(key, value) {
    try {
      const serialized = JSON.stringify(value);
      
      // Check size limits
      if (serialized.length > this.maxStorageSize) {
        throw new Error('Cache item exceeds size limit');
      }

      // Ensure we have space
      await this.ensureStorageSpace(serialized.length);

      localStorage.setItem(`${this.storagePrefix}${key}`, serialized);
    } catch (error) {
      throw new DataSyncError(
        'storage',
        'Failed to persist cache item',
        { originalError: error.message }
      );
    }
  }

  async getPersistentCache(key) {
    try {
      const serialized = localStorage.getItem(`${this.storagePrefix}${key}`);
      return serialized ? JSON.parse(serialized) : null;
    } catch (error) {
      throw new DataSyncError(
        'storage',
        'Failed to retrieve cached item',
        { originalError: error.message }
      );
    }
  }

  async ensureStorageSpace(requiredBytes) {
    try {
      let currentSize = 0;
      const items = [];

      // Calculate current size and collect items
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(this.storagePrefix)) {
          const value = localStorage.getItem(key);
          currentSize += value.length;
          items.push({
            key,
            size: value.length,
            timestamp: JSON.parse(value).timestamp
          });
        }
      }

      // If we need to free up space
      if (currentSize + requiredBytes > this.maxStorageSize) {
        // Sort by timestamp (oldest first)
        items.sort((a, b) => a.timestamp - b.timestamp);

        // Remove items until we have enough space
        let freedSpace = 0;
        for (const item of items) {
          localStorage.removeItem(item.key);
          freedSpace += item.size;
          if (currentSize - freedSpace + requiredBytes <= this.maxStorageSize) {
            break;
          }
        }
      }
    } catch (error) {
      throw new Error('Failed to ensure storage space: ' + error.message);
    }
  }

  isExpired(cacheItem) {
    return cacheItem.expiry && Date.now() > cacheItem.expiry;
  }

  async cleanupExpired() {
    try {
      // Cleanup memory cache
      for (const [key, item] of this.memoryCache) {
        if (this.isExpired(item)) {
          this.memoryCache.delete(key);
        }
      }

      // Cleanup persistent storage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(this.storagePrefix)) {
          try {
            const item = JSON.parse(localStorage.getItem(key));
            if (this.isExpired(item)) {
              localStorage.removeItem(key);
            }
          } catch (error) {
            // Remove invalid items
            localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      this.handleError(error, { action: 'cleanupExpired' });
    }
  }

  handleError(error, context = {}) {
    errorReportingService.reportError(error, null, {
      component: 'CacheService',
      ...context
    });
  }

  // Utility methods
  async clear() {
    try {
      // Clear memory cache
      this.memoryCache.clear();

      // Clear persistent storage
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key.startsWith(this.storagePrefix)) {
          localStorage.removeItem(key);
        }
      }

      return true;
    } catch (error) {
      this.handleError(error, { action: 'clear' });
      return false;
    }
  }

  getStats() {
    return {
      memoryItems: this.memoryCache.size,
      persistentItems: this.getPersistentItemCount(),
      totalSize: this.getTotalSize()
    };
  }

  getPersistentItemCount() {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).startsWith(this.storagePrefix)) {
        count++;
      }
    }
    return count;
  }

  getTotalSize() {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.storagePrefix)) {
        size += localStorage.getItem(key).length;
      }
    }
    return size;
  }
}

export const cacheService = new CacheService(); 