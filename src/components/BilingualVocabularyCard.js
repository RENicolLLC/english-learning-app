import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  VolumeUp as VolumeUpIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import ErrorBoundary from './ErrorBoundary';
import { errorReportingService, DataSyncError, ValidationError } from '../services/error/errorReportingService';

// Vocabulary-specific error boundary
const VocabularyErrorBoundary = ({ children, onRetry }) => (
  <ErrorBoundary
    fallback={(error, reset) => (
      <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light' }}>
        <ErrorIcon sx={{ fontSize: 40, color: 'error.main', mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          {error instanceof DataSyncError ? 'Data Sync Error' : 'Vocabulary Card Error'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {error instanceof DataSyncError 
            ? 'Failed to sync vocabulary data. Your progress may not be saved.'
            : 'There was a problem loading the vocabulary card.'}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={() => {
              reset();
              onRetry?.();
            }}
          >
            Retry
          </Button>
        </Box>
      </Card>
    )}
  >
    {children}
  </ErrorBoundary>
);

const BilingualVocabularyCard = ({ word, translations, examples, onProgress }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced', 'syncing', 'error'
  const [localProgress, setLocalProgress] = useState(null);

  useEffect(() => {
    loadVocabularyData();
  }, [word]);

  const loadVocabularyData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate word data
      validateWordData();
      
      // Load progress from local storage first
      const savedProgress = localStorage.getItem(`vocab_progress_${word.id}`);
      if (savedProgress) {
        setLocalProgress(JSON.parse(savedProgress));
      }

      // Then sync with server
      await syncProgress();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateWordData = () => {
    if (!word?.id || !word?.term) {
      throw new ValidationError('Invalid vocabulary word data');
    }
    if (!translations || translations.length === 0) {
      throw new ValidationError('Missing translations');
    }
  };

  const syncProgress = async () => {
    try {
      setSyncStatus('syncing');
      if (!localProgress) return;

      const result = await onProgress(word.id, localProgress);
      if (!result) {
        throw new DataSyncError('sync', 'Failed to sync with server');
      }

      setSyncStatus('synced');
    } catch (error) {
      setSyncStatus('error');
      throw new DataSyncError('sync', error.message);
    }
  };

  const handleProgress = async (progressData) => {
    try {
      // Save locally first
      const newProgress = {
        ...localProgress,
        ...progressData,
        timestamp: new Date().toISOString()
      };
      
      setLocalProgress(newProgress);
      localStorage.setItem(`vocab_progress_${word.id}`, JSON.stringify(newProgress));

      // Then try to sync
      await syncProgress();
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    setError(error.message);
    errorReportingService.reportError(error, null, {
      component: 'BilingualVocabularyCard',
      wordId: word?.id,
      action: 'progress'
    });
  };

  const handleRetry = () => {
    loadVocabularyData();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ mb: 2 }}
        action={
          <Button color="inherit" size="small" onClick={handleRetry}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <VocabularyErrorBoundary onRetry={handleRetry}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">{word.term}</Typography>
            {syncStatus === 'error' && (
              <IconButton 
                color="warning" 
                onClick={syncProgress}
                title="Sync failed. Click to retry."
              >
                <RefreshIcon />
              </IconButton>
            )}
          </Box>
          
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Translations:
          </Typography>
          {translations.map((translation, index) => (
            <Typography key={index} paragraph>
              {translation}
            </Typography>
          ))}

          {examples && examples.length > 0 && (
            <>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Examples:
              </Typography>
              {examples.map((example, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography>{example.text}</Typography>
                  <Typography color="textSecondary" variant="body2">
                    {example.translation}
                  </Typography>
                </Box>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </VocabularyErrorBoundary>
  );
};

export default BilingualVocabularyCard; 