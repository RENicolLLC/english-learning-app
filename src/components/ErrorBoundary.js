import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Alert,
  AlertTitle
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { errorReportingService, reportErrorBoundary } from '../services/error/errorReportingService';

const ErrorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.contrastText
}));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorDetails: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Report error to our service
    reportErrorBoundary(error, errorInfo);

    // Format error for display
    const errorDetails = errorReportingService.formatErrorForDisplay(error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorDetails: errorDetails
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorDetails: null
    });
    // Attempt to recover by resetting the component's state
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Check if we have a custom fallback
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      const { errorDetails } = this.state;

      // Default error UI
      return (
        <Container maxWidth="sm">
          <ErrorContainer elevation={3}>
            <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="error.main">
              {errorDetails?.title || 'Oops! Something went wrong'}
            </Typography>
            <Typography variant="body1" paragraph>
              {errorDetails?.message || 'We apologize for the inconvenience. The application encountered an unexpected error.'}
            </Typography>
            
            {errorDetails?.details && (
              <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
                <AlertTitle>Technical Details</AlertTitle>
                <Box component="pre" sx={{ 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-word',
                  fontSize: '0.875rem'
                }}>
                  {JSON.stringify(errorDetails.details, null, 2)}
                </Box>
              </Alert>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </Box>
          </ErrorContainer>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 