import { AuthService } from '../services/AuthService';

export const TestUtils = {
  // Admin bypass utilities
  admin: {
    async login(): Promise<string> {
      const authService = AuthService.getInstance();
      return await authService.adminLogin({
        username: 'test_admin',
        password: 'test_password',
        bypassKey: process.env.REACT_APP_ADMIN_BYPASS_KEY
      });
    },

    async impersonateUser(userId: string): Promise<string> {
      const token = await this.login();
      const response = await fetch('/api/admin/bypass-auth', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      return data.token;
    }
  },

  // UI testing utilities
  ui: {
    async setViewportSize(width: number, height: number): Promise<void> {
      window.innerWidth = width;
      window.innerHeight = height;
      window.dispatchEvent(new Event('resize'));
    },

    async waitForElement(selector: string, timeout = 5000): Promise<Element> {
      const startTime = Date.now();
      return new Promise((resolve, reject) => {
        const check = () => {
          const element = document.querySelector(selector);
          if (element) {
            resolve(element);
          } else if (Date.now() - startTime > timeout) {
            reject(new Error(`Element ${selector} not found after ${timeout}ms`));
          } else {
            requestAnimationFrame(check);
          }
        };
        check();
      });
    }
  }
}; 