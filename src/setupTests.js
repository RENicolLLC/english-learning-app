import '@testing-library/jest-dom';

// Mock environment variables
process.env.REACT_APP_SUPABASE_URL = 'https://test-url.supabase.co';
process.env.REACT_APP_SUPABASE_ANON_KEY = 'test-key';

// Mock services
jest.mock('./services/auth/AuthContext');
jest.mock('./services/auth/supabaseClient');
jest.mock('./services/api/apiClient');
jest.mock('./services/error/errorReportingService');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock }); 