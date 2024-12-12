export const errorReportingService = {
  init: jest.fn(),
  reportError: jest.fn(),
  formatErrorForDisplay: jest.fn().mockReturnValue({
    title: 'Test Error',
    message: 'Test error message',
    details: { stack: 'Test stack trace' }
  }),
  processErrors: jest.fn(),
  clearErrors: jest.fn()
};

export const reportErrorBoundary = jest.fn();

export default errorReportingService; 