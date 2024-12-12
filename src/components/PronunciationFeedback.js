import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Button,
  IconButton
} from '@mui/material';
import {
  VolumeUp as VolumeUpIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import ErrorBoundary from './ErrorBoundary';
import { errorReportingService, PronunciationError, NetworkError } from '../services/error/errorReportingService';

const PronunciationErrorBoundary = ({ children, onRetry }) => (
  <ErrorBoundary
    fallback={(error, reset) => (
      <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light' }}>
        <ErrorIcon sx={{ fontSize: 40, color: 'error.main', mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          {error instanceof PronunciationError ? 'Pronunciation Analysis Error' : 'Feedback Error'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {error instanceof PronunciationError 
            ? 'There was a problem analyzing your pronunciation.'
            : 'There was a problem providing feedback.'}
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
            Try Again
          </Button>
        </Box>
      </Card>
    )}
  >
    {children}
  </ErrorBoundary>
);

const PronunciationFeedback = ({ 
  recordedAudio, 
  targetWord, 
  language, 
  onRetry, 
  onNewWord 
}) => {
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    if (recordedAudio && targetWord) {
      analyzePronunciation();
    }
  }, [recordedAudio, targetWord]);

  const analyzePronunciation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate inputs
      if (!recordedAudio) {
        throw new PronunciationError(targetWord, language, 'No audio recording provided');
      }

      if (!targetWord) {
        throw new PronunciationError(targetWord, language, 'No target word provided');
      }

      // Convert audio to proper format if needed
      const audioBlob = await prepareAudioForAnalysis(recordedAudio);

      // Send to AI service for analysis
      const result = await sendToAIService(audioBlob, targetWord, language);

      if (!result.success) {
        throw new PronunciationError(
          targetWord,
          language,
          result.error || 'Failed to analyze pronunciation',
          { score: result.score }
        );
      }

      setFeedback(result);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const prepareAudioForAnalysis = async (audioData) => {
    try {
      // Convert audio to proper format (e.g., WAV)
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(await audioData.arrayBuffer());
      
      // Create WAV blob
      const wavBlob = await convertToWav(audioBuffer);
      return wavBlob;
    } catch (error) {
      throw new PronunciationError(
        targetWord,
        language,
        'Failed to process audio recording',
        { originalError: error.message }
      );
    }
  };

  const convertToWav = async (audioBuffer) => {
    // Implementation of WAV conversion
    // This is a placeholder - actual implementation would depend on your audio processing library
    return new Blob(['audio data'], { type: 'audio/wav' });
  };

  const sendToAIService = async (audioBlob, word, lang) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('word', word);
      formData.append('language', lang);

      const response = await fetch('/api/analyze-pronunciation', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new NetworkError('Rate limit exceeded for pronunciation analysis');
        }
        throw new NetworkError(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof NetworkError) {
        throw error;
      }
      throw new NetworkError('Failed to connect to pronunciation service');
    }
  };

  const handleError = (error) => {
    setError(error);
    errorReportingService.reportError(error, null, {
      component: 'PronunciationFeedback',
      word: targetWord,
      language,
      retryCount
    });

    // Implement retry logic for certain errors
    if (error instanceof NetworkError && retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      setTimeout(analyzePronunciation, 1000 * (retryCount + 1)); // Exponential backoff
    }
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    analyzePronunciation();
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
            Try Again
          </Button>
        }
      >
        <AlertTitle>Error</AlertTitle>
        {error.message}
      </Alert>
    );
  }

  if (!feedback) {
    return null;
  }

  return (
    <PronunciationErrorBoundary onRetry={handleRetry}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Pronunciation Feedback</Typography>
            <IconButton 
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(targetWord);
                utterance.lang = language;
                window.speechSynthesis.speak(utterance);
              }}
              title="Listen to correct pronunciation"
            >
              <VolumeUpIcon />
            </IconButton>
          </Box>

          <Typography variant="body1" gutterBottom>
            Word: <strong>{targetWord}</strong>
          </Typography>

          <Typography variant="body1" gutterBottom>
            Score: <strong>{feedback.score}/100</strong>
          </Typography>

          {feedback.phonemes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Phoneme Analysis:
              </Typography>
              {feedback.phonemes.map((phoneme, index) => (
                <Typography 
                  key={index} 
                  variant="body2"
                  color={phoneme.score > 80 ? 'success.main' : phoneme.score > 60 ? 'warning.main' : 'error.main'}
                >
                  {phoneme.sound}: {phoneme.score}%
                </Typography>
              ))}
            </Box>
          )}

          {feedback.suggestions && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Suggestions for Improvement:
              </Typography>
              {feedback.suggestions.map((suggestion, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                  • {suggestion}
                </Typography>
              ))}
            </Box>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={onRetry}
              startIcon={<RefreshIcon />}
            >
              Try Again
            </Button>
            <Button 
              variant="outlined"
              onClick={onNewWord}
            >
              Next Word
            </Button>
          </Box>
        </CardContent>
      </Card>
    </PronunciationErrorBoundary>
  );
};

export default PronunciationFeedback; 