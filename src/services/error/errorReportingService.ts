export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DataSyncError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataSyncError';
  }
}

export const errorReportingService = {
  reportError(error: Error): void {
    console.error('Error:', error);
    // Implement error reporting logic here
  },
  
  reportValidationError(error: ValidationError): void {
    console.error('Validation Error:', error);
    // Implement validation error reporting logic
  },
  
  reportDataSyncError(error: DataSyncError): void {
    console.error('Data Sync Error:', error);
    // Implement data sync error reporting logic
  }
};

export const reportErrorBoundary = (error: Error, componentStack: string): void => {
  console.error('React Error Boundary caught an error:', error);
  console.error('Component Stack:', componentStack);
  // Implement error boundary reporting logic
};

export default errorReportingService; 