import { errorReportingService, ValidationError } from '../error/errorReportingService';

class AccessibilityService {
  constructor() {
    this.settings = {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      colorBlindMode: false,
      textToSpeech: true,
      autoplay: false,
      captions: true
    };
    this.initialized = false;
    this.observers = new Set();
  }

  async initialize() {
    try {
      if (this.initialized) return;

      // Load system preferences
      await this.loadSystemPreferences();
      
      // Load user preferences
      await this.loadUserPreferences();
      
      // Initialize screen reader detection
      this.detectScreenReader();
      
      // Set up media query listeners
      this.setupMediaQueryListeners();
      
      this.initialized = true;
    } catch (error) {
      this.handleError(error, { action: 'initialize' });
      // Use default settings if initialization fails
      this.settings = this.getDefaultSettings();
    }
  }

  async loadSystemPreferences() {
    try {
      // Check prefers-reduced-motion
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.settings.reducedMotion = reducedMotion.matches;

      // Check prefers-color-scheme
      const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
      this.settings.highContrast = darkMode.matches;

      // Check prefers-reduced-data
      const reducedData = window.matchMedia('(prefers-reduced-data: reduce)');
      this.settings.autoplay = !reducedData.matches;
    } catch (error) {
      throw new Error('Failed to load system preferences: ' + error.message);
    }
  }

  async loadUserPreferences() {
    try {
      const savedSettings = localStorage.getItem('accessibility_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        this.validateSettings(parsedSettings);
        this.settings = {
          ...this.settings,
          ...parsedSettings
        };
      }
    } catch (error) {
      throw new Error('Failed to load user preferences: ' + error.message);
    }
  }

  detectScreenReader() {
    try {
      // Check for common screen reader indicators
      this.settings.screenReader = !!(
        window.speechSynthesis ||
        document.querySelector('[role="application"]') ||
        document.querySelector('[aria-live]')
      );
    } catch (error) {
      this.handleError(error, { action: 'detectScreenReader' });
    }
  }

  setupMediaQueryListeners() {
    try {
      // Listen for system preference changes
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      reducedMotion.addEventListener('change', e => {
        this.updateSetting('reducedMotion', e.matches);
      });

      const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
      darkMode.addEventListener('change', e => {
        this.updateSetting('highContrast', e.matches);
      });
    } catch (error) {
      this.handleError(error, { action: 'setupMediaQueryListeners' });
    }
  }

  validateSettings(settings) {
    // Validate font size
    if (settings.fontSize && !['small', 'medium', 'large'].includes(settings.fontSize)) {
      throw new ValidationError('Invalid font size setting');
    }

    // Validate boolean settings
    const booleanSettings = [
      'highContrast',
      'reducedMotion',
      'screenReader',
      'keyboardNavigation',
      'colorBlindMode',
      'textToSpeech',
      'autoplay',
      'captions'
    ];

    booleanSettings.forEach(setting => {
      if (settings[setting] !== undefined && typeof settings[setting] !== 'boolean') {
        throw new ValidationError(`Invalid ${setting} setting`);
      }
    });
  }

  async updateSettings(newSettings) {
    try {
      // Validate new settings
      this.validateSettings(newSettings);

      // Update settings
      this.settings = {
        ...this.settings,
        ...newSettings
      };

      // Save to localStorage
      await this.saveSettings();

      // Notify observers
      this.notifyObservers();

      return true;
    } catch (error) {
      this.handleError(error, {
        action: 'updateSettings',
        settings: newSettings
      });
      throw error;
    }
  }

  async saveSettings() {
    try {
      localStorage.setItem('accessibility_settings', JSON.stringify(this.settings));
    } catch (error) {
      throw new Error('Failed to save settings: ' + error.message);
    }
  }

  subscribe(callback) {
    if (typeof callback !== 'function') {
      throw new ValidationError('Callback must be a function');
    }
    this.observers.add(callback);

    // Return unsubscribe function
    return () => this.observers.delete(callback);
  }

  notifyObservers() {
    this.observers.forEach(callback => {
      try {
        callback(this.settings);
      } catch (error) {
        this.handleError(error, {
          action: 'notifyObserver',
          callback: callback.name
        });
      }
    });
  }

  // Text-to-Speech functionality
  async speak(text, options = {}) {
    try {
      if (!this.settings.textToSpeech) return;

      this.validateSpeechOptions(options);

      const utterance = new SpeechSynthesisUtterance(text);
      Object.assign(utterance, options);

      return new Promise((resolve, reject) => {
        utterance.onend = resolve;
        utterance.onerror = reject;
        window.speechSynthesis.speak(utterance);
      });
    } catch (error) {
      this.handleError(error, {
        action: 'speak',
        text,
        options
      });
      throw error;
    }
  }

  validateSpeechOptions(options) {
    const validVoices = window.speechSynthesis.getVoices();
    if (options.voice && !validVoices.includes(options.voice)) {
      throw new ValidationError('Invalid voice option');
    }

    if (options.rate && (options.rate < 0.1 || options.rate > 10)) {
      throw new ValidationError('Invalid rate option (must be between 0.1 and 10)');
    }

    if (options.pitch && (options.pitch < 0 || options.pitch > 2)) {
      throw new ValidationError('Invalid pitch option (must be between 0 and 2)');
    }
  }

  // Focus management
  setFocus(elementId) {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id '${elementId}' not found`);
      }
      element.focus();
    } catch (error) {
      this.handleError(error, {
        action: 'setFocus',
        elementId
      });
    }
  }

  // Keyboard navigation
  enableKeyboardNavigation() {
    try {
      if (!this.settings.keyboardNavigation) return;

      document.addEventListener('keydown', this.handleKeyboardNavigation);
    } catch (error) {
      this.handleError(error, {
        action: 'enableKeyboardNavigation'
      });
    }
  }

  handleKeyboardNavigation = (event) => {
    try {
      // Handle keyboard navigation logic
      if (event.key === 'Tab') {
        // Enhance tab navigation
        this.handleTabNavigation(event);
      } else if (event.key === 'Escape') {
        // Handle escape key
        this.handleEscapeKey();
      }
    } catch (error) {
      this.handleError(error, {
        action: 'handleKeyboardNavigation',
        key: event.key
      });
    }
  };

  handleTabNavigation(event) {
    // Implementation of enhanced tab navigation
    // This is a placeholder for the actual implementation
  }

  handleEscapeKey() {
    // Implementation of escape key handling
    // This is a placeholder for the actual implementation
  }

  // Error handling
  handleError(error, context = {}) {
    errorReportingService.reportError(error, null, {
      component: 'AccessibilityService',
      ...context
    });
  }

  // Utility methods
  getDefaultSettings() {
    return {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      colorBlindMode: false,
      textToSpeech: true,
      autoplay: false,
      captions: true
    };
  }

  resetSettings() {
    try {
      this.settings = this.getDefaultSettings();
      this.saveSettings();
      this.notifyObservers();
      return true;
    } catch (error) {
      this.handleError(error, {
        action: 'resetSettings'
      });
      return false;
    }
  }

  isInitialized() {
    return this.initialized;
  }
}

export const accessibilityService = new AccessibilityService(); 