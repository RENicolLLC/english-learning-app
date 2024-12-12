import { analyticsService } from '../analytics/analyticsService';
import { supabase } from '../auth/supabaseClient';
import * as Sentry from "@sentry/react";

// Initialize Sentry
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", "englishlearningapp.com"],
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: process.env.NODE_ENV
});

// Base Error class for all application errors
class AppError extends Error {
  constructor(type, message, metadata = {}) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.metadata = metadata;
    this.timestamp = new Date().toISOString();
  }
}

// Network and API Errors
export class NetworkError extends AppError {
  constructor(operation, message, metadata = {}) {
    super('network', message, { operation, ...metadata });
  }
}

export class APIError extends AppError {
  constructor(endpoint, statusCode, message, metadata = {}) {
    super('api', message, { endpoint, statusCode, ...metadata });
  }
}

// Data and Validation Errors
export class ValidationError extends AppError {
  constructor(message, metadata = {}) {
    super('validation', message, metadata);
  }
}

export class DataSyncError extends AppError {
  constructor(operation, message, metadata = {}) {
    super('data_sync', message, { operation, ...metadata });
  }
}

export class DataFormatError extends AppError {
  constructor(dataType, message, metadata = {}) {
    super('data_format', message, { dataType, ...metadata });
  }
}

// Resource and Rate Limit Errors
export class ResourceNotFoundError extends AppError {
  constructor(resource, message, metadata = {}) {
    super('not_found', message, { resource, ...metadata });
  }
}

export class RateLimitError extends AppError {
  constructor(service, limit, metadata = {}) {
    super('rate_limit', `Rate limit exceeded for ${service}`, { service, limit, ...metadata });
  }
}

// Authentication and Authorization Errors
export class AuthenticationError extends AppError {
  constructor(message, metadata = {}) {
    super('authentication', message, metadata);
  }
}

export class AuthorizationError extends AppError {
  constructor(resource, action, metadata = {}) {
    super('authorization', `Not authorized to ${action} ${resource}`, { resource, action, ...metadata });
  }
}

// Vocabulary-specific Errors
export class VocabularyError extends AppError {
  constructor(operation, message, metadata = {}) {
    super('vocabulary', message, { operation, ...metadata });
  }
}

export class PronunciationError extends AppError {
  constructor(word, language, message, metadata = {}) {
    super('pronunciation', message, { word, language, ...metadata });
  }
}

export class TranslationError extends AppError {
  constructor(text, fromLang, toLang, message, metadata = {}) {
    super('translation', message, { text, fromLang, toLang, ...metadata });
  }
}

// Error Reporting Service
class ErrorReportingService {
  constructor() {
    this.errorQueue = [];
    this.isProcessing = false;
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  async reportError(error, context = null, metadata = {}) {
    const errorReport = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        type: error instanceof AppError ? error.type : 'unknown',
        metadata: error instanceof AppError ? error.metadata : {},
      },
      context: {
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ...context
      },
      metadata: {
        ...metadata,
        sessionId: this.getSessionId()
      }
    };

    // Add to queue and process
    this.errorQueue.push(errorReport);
    if (!this.isProcessing) {
      await this.processErrorQueue();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Report:', errorReport);
    }

    return errorReport;
  }

  async processErrorQueue() {
    if (this.isProcessing || this.errorQueue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      while (this.errorQueue.length > 0) {
        const error = this.errorQueue.shift();
        await this.sendErrorToServer(error);
      }
    } catch (err) {
      console.error('Error processing error queue:', err);
    } finally {
      this.isProcessing = false;
    }
  }

  async sendErrorToServer(errorReport) {
    // Implementation would depend on your backend API
    // This is a placeholder implementation
    try {
      console.log('Sending error to server:', errorReport);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Failed to send error to server:', error);
      throw error;
    }
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('errorReportingSessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('errorReportingSessionId', sessionId);
    }
    return sessionId;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const errorReportingService = new ErrorReportingService();

// Error boundary specific reporter
export const reportErrorBoundary = (error, errorInfo) => {
  errorReportingService.reportError(error, errorInfo, {
    type: 'boundary',
    location: window.location.href
  });
};

// API error reporter
export const reportAPIError = (error, endpoint) => {
  errorReportingService.reportError(error, null, {
    type: 'api',
    endpoint
  });
};

export default errorReportingService; 