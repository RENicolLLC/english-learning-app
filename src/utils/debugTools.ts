export class DebugTools {
  private static instance: DebugTools;
  private isDebugMode: boolean = false;
  private logs: DebugLog[] = [];
  private breakpoints: Set<string> = new Set();

  private constructor() {
    this.setupKeyboardShortcuts();
    this.setupConsoleOverrides();
  }

  static getInstance(): DebugTools {
    if (!DebugTools.instance) {
      DebugTools.instance = new DebugTools();
    }
    return DebugTools.instance;
  }

  enableDebugMode() {
    this.isDebugMode = true;
    this.injectDebugPanel();
  }

  log(message: string, level: LogLevel = 'info', data?: any) {
    const log: DebugLog = {
      message,
      level,
      data,
      timestamp: new Date(),
      stack: new Error().stack
    };

    this.logs.push(log);
    this.updateDebugPanel();

    if (this.isDebugMode) {
      console.log(`[${level.toUpperCase()}]`, message, data);
    }
  }

  setBreakpoint(id: string, condition: () => boolean) {
    this.breakpoints.add(id);
    if (condition()) {
      debugger;
    }
  }

  private setupKeyboardShortcuts() {
    window.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        this.toggleDebugMode();
      }
    });
  }

  private setupConsoleOverrides() {
    if (this.isDebugMode) {
      const originalConsole = { ...console };
      console.log = (...args) => {
        this.log(args.join(' '), 'info');
        originalConsole.log(...args);
      };
    }
  }

  private injectDebugPanel() {
    // Implementation for debug panel UI
  }

  private updateDebugPanel() {
    // Implementation for updating debug panel
  }
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface DebugLog {
  message: string;
  level: LogLevel;
  data?: any;
  timestamp: Date;
  stack?: string;
}