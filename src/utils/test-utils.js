import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../services/auth/AuthContext';
import theme from '../theme';
import { mockUser, mockAuthContext, mockFetchResponses } from './mockData';

// Custom render with providers
const customRender = (ui, { route = '/', authValue = mockAuthContext, ...options } = {}) => {
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }) => (
    <AuthProvider value={authValue}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock API responses
export const mockApi = (path, response) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response)
    })
  );
};

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  global.fetch.mockClear();
  delete global.fetch;
});

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { mockUser, mockAuthContext, mockFetchResponses }; 