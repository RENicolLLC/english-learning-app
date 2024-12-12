import { errorReportingService, TranslationError } from '../error/errorReportingService';

class TranslationService {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second base delay
    this.cache = new Map();
    this.offlineDictionary = new Map();
  }

  async translate(text, fromLang, toLang, options = {}) {
    try {
      // Validate request
      this.validateTranslationRequest(text, fromLang, toLang);

      // Check cache first
      const cacheKey = `${text}_${fromLang}_${toLang}`;
      if (this.cache.has(cacheKey) && !options.skipCache) {
        return this.cache.get(cacheKey);
      }

      // Try online translation with retries
      const translation = await this.handleTranslationRequest(
        text,
        fromLang,
        toLang,
        options
      );

      // Cache successful translation
      this.cache.set(cacheKey, translation);
      return translation;
    } catch (error) {
      // Try offline fallback if online translation fails
      if (error.name === 'NetworkError' && !options.onlineOnly) {
        return this.handleOfflineTranslation(text, fromLang, toLang);
      }
      throw error;
    }
  }

  async handleTranslationRequest(text, fromLang, toLang, options) {
    let lastError = null;
    let attempts = 0;

    while (attempts < this.retryAttempts) {
      try {
        const result = await this.callTranslationAPI(text, fromLang, toLang, options);
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

    const translationError = this.createTranslationError(lastError, text, fromLang, toLang);
    this.reportError(translationError, { attempts, options });
    throw translationError;
  }

  async callTranslationAPI(text, fromLang, toLang, options) {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          fromLang,
          toLang,
          ...options
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.translation) {
        throw new Error('Invalid translation response');
      }

      return data.translation;
    } catch (error) {
      throw this.createTranslationError(error, text, fromLang, toLang);
    }
  }

  shouldRetry(error) {
    return (
      error.name === 'NetworkError' ||
      error.message.includes('rate limit') ||
      error.status === 429 ||
      error.status >= 500
    );
  }

  createTranslationError(originalError, text, fromLang, toLang) {
    let message = 'Translation failed';
    let metadata = {
      originalError: originalError.message,
      textLength: text.length,
      fromLang,
      toLang
    };

    if (originalError.status === 429) {
      message = 'Translation rate limit exceeded';
    } else if (originalError.status >= 500) {
      message = 'Translation service unavailable';
    } else if (originalError.name === 'NetworkError') {
      message = 'Network error during translation';
    }

    return new TranslationError(text, fromLang, toLang, message, metadata);
  }

  reportError(error, context = {}) {
    errorReportingService.reportError(error, null, {
      component: 'TranslationService',
      ...context
    });
  }

  validateTranslationRequest(text, fromLang, toLang) {
    if (!text || typeof text !== 'string') {
      throw new TranslationError(
        text,
        fromLang,
        toLang,
        'Invalid text for translation',
        { reason: 'invalid_text' }
      );
    }

    if (!fromLang || !toLang) {
      throw new TranslationError(
        text,
        fromLang,
        toLang,
        'Missing language parameters',
        { reason: 'invalid_languages' }
      );
    }

    if (text.length > 5000) {
      throw new TranslationError(
        text,
        fromLang,
        toLang,
        'Text too long for translation',
        { textLength: text.length, maxLength: 5000 }
      );
    }
  }

  handleOfflineTranslation(text, fromLang, toLang) {
    // Check offline dictionary
    const key = `${text.toLowerCase()}_${fromLang}_${toLang}`;
    if (this.offlineDictionary.has(key)) {
      return this.offlineDictionary.get(key);
    }

    throw new TranslationError(
      text,
      fromLang,
      toLang,
      'Offline translation not available',
      { reason: 'offline' }
    );
  }

  // Method to preload offline dictionary
  async preloadOfflineDictionary(languagePair) {
    try {
      const response = await fetch(`/api/offline-dictionary/${languagePair}`);
      if (!response.ok) {
        throw new Error(`Failed to load offline dictionary: ${response.status}`);
      }

      const dictionary = await response.json();
      dictionary.forEach(({ source, target, translation }) => {
        const key = `${source.toLowerCase()}_${languagePair}`;
        this.offlineDictionary.set(key, translation);
      });
    } catch (error) {
      this.reportError(new TranslationError(
        '',
        languagePair.split('_')[0],
        languagePair.split('_')[1],
        'Failed to load offline dictionary',
        { originalError: error.message }
      ));
    }
  }

  clearCache() {
    this.cache.clear();
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const translationService = new TranslationService(); 