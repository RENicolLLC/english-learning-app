import { errorReportingService, ValidationError, DataSyncError } from '../error/errorReportingService';

class MediaService {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    this.maxCacheSize = 100; // Maximum number of cached items
    this.supportedTypes = {
      audio: ['mp3', 'wav', 'ogg'],
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      video: ['mp4', 'webm']
    };
  }

  async loadMedia(url, options = {}) {
    try {
      // Validate input
      this.validateMediaUrl(url);
      this.validateOptions(options);

      // Check cache first
      if (!options.bypassCache) {
        const cached = this.getFromCache(url);
        if (cached) return cached;
      }

      // Check if already loading
      if (this.loadingPromises.has(url)) {
        return this.loadingPromises.get(url);
      }

      // Start loading with retry logic
      const loadPromise = this.loadWithRetry(url, options);
      this.loadingPromises.set(url, loadPromise);

      try {
        const result = await loadPromise;
        this.loadingPromises.delete(url);
        return result;
      } catch (error) {
        this.loadingPromises.delete(url);
        throw error;
      }
    } catch (error) {
      this.handleError(error, {
        action: 'loadMedia',
        url,
        options
      });
      throw error;
    }
  }

  validateMediaUrl(url) {
    if (!url || typeof url !== 'string') {
      throw new ValidationError('Invalid media URL');
    }

    try {
      new URL(url);
    } catch {
      throw new ValidationError('Invalid URL format');
    }

    const extension = url.split('.').pop().toLowerCase();
    const isSupported = Object.values(this.supportedTypes)
      .flat()
      .includes(extension);

    if (!isSupported) {
      throw new ValidationError(`Unsupported file type: ${extension}`);
    }
  }

  validateOptions(options) {
    const validOptions = [
      'bypassCache',
      'preload',
      'quality',
      'timeout',
      'crossOrigin'
    ];

    Object.keys(options).forEach(key => {
      if (!validOptions.includes(key)) {
        throw new ValidationError(`Invalid option: ${key}`);
      }
    });

    if (options.quality && !['low', 'medium', 'high'].includes(options.quality)) {
      throw new ValidationError('Invalid quality option');
    }

    if (options.timeout && (typeof options.timeout !== 'number' || options.timeout < 0)) {
      throw new ValidationError('Invalid timeout value');
    }
  }

  async loadWithRetry(url, options) {
    let lastError = null;
    let attempts = 0;

    while (attempts < this.retryAttempts) {
      try {
        const result = await this.loadMediaResource(url, options);
        
        // Cache successful result
        if (!options.bypassCache) {
          this.addToCache(url, result);
        }

        return result;
      } catch (error) {
        lastError = error;
        attempts++;

        if (this.shouldRetry(error)) {
          await this.delay(this.retryDelay * attempts);
          continue;
        }
        break;
      }
    }

    throw lastError;
  }

  async loadMediaResource(url, options) {
    const mediaType = this.getMediaType(url);
    const controller = new AbortController();
    const { signal } = controller;

    // Set timeout if specified
    if (options.timeout) {
      setTimeout(() => controller.abort(), options.timeout);
    }

    try {
      switch (mediaType) {
        case 'image':
          return await this.loadImage(url, options, signal);
        case 'audio':
          return await this.loadAudio(url, options, signal);
        case 'video':
          return await this.loadVideo(url, options, signal);
        default:
          throw new ValidationError(`Unsupported media type: ${mediaType}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Media loading timed out');
      }
      throw error;
    }
  }

  async loadImage(url, options, signal) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      if (options.crossOrigin) {
        img.crossOrigin = options.crossOrigin;
      }

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      
      // Handle abort signal
      if (signal) {
        signal.addEventListener('abort', () => {
          img.src = '';
          reject(new Error('Image loading aborted'));
        });
      }

      img.src = url;
    });
  }

  async loadAudio(url, options, signal) {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    return new Audio(URL.createObjectURL(blob));
  }

  async loadVideo(url, options, signal) {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const video = document.createElement('video');
    video.src = URL.createObjectURL(blob);
    return video;
  }

  getMediaType(url) {
    const extension = url.split('.').pop().toLowerCase();
    
    for (const [type, extensions] of Object.entries(this.supportedTypes)) {
      if (extensions.includes(extension)) {
        return type;
      }
    }
    
    return null;
  }

  shouldRetry(error) {
    return (
      error.name === 'NetworkError' ||
      error.message.includes('timeout') ||
      error.message.includes('failed to fetch') ||
      error.message.includes('network error')
    );
  }

  getFromCache(url) {
    return this.cache.get(url);
  }

  addToCache(url, resource) {
    // Implement LRU cache eviction if needed
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(url, resource);
  }

  clearCache() {
    this.cache.clear();
  }

  preloadMedia(urls) {
    return Promise.all(
      urls.map(url => this.loadMedia(url, { preload: true }))
    );
  }

  handleError(error, context = {}) {
    errorReportingService.reportError(error, null, {
      component: 'MediaService',
      ...context
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility methods
  isMediaLoaded(url) {
    return this.cache.has(url);
  }

  getCacheSize() {
    return this.cache.size;
  }

  getLoadingCount() {
    return this.loadingPromises.size;
  }
}

export const mediaService = new MediaService(); 