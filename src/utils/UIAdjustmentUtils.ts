export class UIAdjustmentUtils {
  private static instance: UIAdjustmentUtils;
  private devMode: boolean = false;

  private constructor() {}

  static getInstance(): UIAdjustmentUtils {
    if (!UIAdjustmentUtils.instance) {
      UIAdjustmentUtils.instance = new UIAdjustmentUtils();
    }
    return UIAdjustmentUtils.instance;
  }

  enableDevMode(): void {
    this.devMode = true;
    document.body.classList.add('dev-mode');
    this.injectDevStyles();
    this.addGridOverlay();
  }

  disableDevMode(): void {
    this.devMode = false;
    document.body.classList.remove('dev-mode');
    this.removeDevStyles();
    this.removeGridOverlay();
  }

  private injectDevStyles(): void {
    const style = document.createElement('style');
    style.id = 'dev-mode-styles';
    style.textContent = `
      .dev-mode * {
        outline: 1px solid rgba(255, 0, 0, 0.1);
      }
      .dev-mode *:hover {
        outline: 2px solid rgba(255, 0, 0, 0.5);
      }
      .grid-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 9999;
      }
      .grid-overlay .grid-line {
        background: rgba(0, 0, 255, 0.1);
      }
    `;
    document.head.appendChild(style);
  }

  private addGridOverlay(): void {
    const overlay = document.createElement('div');
    overlay.className = 'grid-overlay';
    // Add grid lines...
    document.body.appendChild(overlay);
  }

  private removeDevStyles(): void {
    const style = document.getElementById('dev-mode-styles');
    if (style) {
      style.remove();
    }
  }

  private removeGridOverlay(): void {
    const overlay = document.querySelector('.grid-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  adjustElementSpacing(element: HTMLElement, spacing: number): void {
    if (!this.devMode) return;
    
    element.style.margin = `${spacing}px`;
    element.style.padding = `${spacing}px`;
  }

  highlightElement(element: HTMLElement): void {
    if (!this.devMode) return;

    element.style.boxShadow = '0 0 0 2px red';
    setTimeout(() => {
      element.style.boxShadow = '';
    }, 2000);
  }
} 