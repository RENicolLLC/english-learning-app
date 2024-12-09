import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Typography,
  LinearProgress,
  Alert,
  AlertTitle,
  Card,
  CardContent
} from '@mui/material';
import {
  Mic as MicIcon,
  Stop as StopIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import ErrorBoundary from './ErrorBoundary';
import { errorReportingService } from '../services/error/errorReportingService';

// Custom error types
class AudioError extends Error {
  constructor(message, metadata = {}) {
    super(message);
    this.name = 'AudioError';
    this.metadata = metadata;
  }
}

class DeviceError extends AudioError {
  constructor(message, metadata = {}) {
    super(message, metadata);
    this.name = 'DeviceError';
  }
}

class RecordingError extends AudioError {
  constructor(message, metadata = {}) {
    super(message, metadata);
    this.name = 'RecordingError';
  }
}

const AudioErrorBoundary = ({ children, onRetry }) => (
  <ErrorBoundary
    fallback={(error, reset) => (
      <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light' }}>
        <ErrorIcon sx={{ fontSize: 40, color: 'error.main', mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          {error instanceof DeviceError ? 'Microphone Error' : 'Recording Error'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {error instanceof DeviceError 
            ? 'Unable to access your microphone. Please check your permissions.'
            : 'There was a problem with the audio recording.'}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <IconButton
            color="primary"
            onClick={() => {
              reset();
              onRetry?.();
            }}
            title="Try again"
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Card>
    )}
  >
    {children}
  </ErrorBoundary>
);

const AudioRecorder = ({ onRecordingComplete, maxDuration = 30 }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const durationInterval = useRef(null);

  useEffect(() => {
    checkPermissions();
    return () => cleanup();
  }, []);

  const checkPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
    } catch (error) {
      handleError(new DeviceError(
        'Microphone access denied',
        { originalError: error.message }
      ));
      setHasPermission(false);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      setDuration(0);
      audioChunks.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorder.current.addEventListener('dataavailable', handleDataAvailable);
      mediaRecorder.current.addEventListener('error', handleRecordingError);
      mediaRecorder.current.addEventListener('stop', handleRecordingStop);

      mediaRecorder.current.start();
      setIsRecording(true);

      // Start duration timer
      durationInterval.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      // Auto-stop after maxDuration
      setTimeout(() => {
        if (mediaRecorder.current?.state === 'recording') {
          stopRecording();
        }
      }, maxDuration * 1000);

    } catch (error) {
      handleError(new DeviceError(
        'Failed to start recording',
        { originalError: error.message }
      ));
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorder.current?.state === 'recording') {
        mediaRecorder.current.stop();
        cleanup();
      }
    } catch (error) {
      handleError(new RecordingError(
        'Failed to stop recording',
        { originalError: error.message }
      ));
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.current.push(event.data);
    }
  };

  const handleRecordingError = (event) => {
    handleError(new RecordingError(
      'Recording failed',
      { originalError: event.error }
    ));
    cleanup();
  };

  const handleRecordingStop = () => {
    try {
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
      setAudioBlob(blob);
      onRecordingComplete?.(blob);
      setIsRecording(false);
    } catch (error) {
      handleError(new RecordingError(
        'Failed to process recording',
        { originalError: error.message }
      ));
    }
  };

  const handleError = (error) => {
    setError(error);
    setIsRecording(false);
    cleanup();

    errorReportingService.reportError(error, null, {
      component: 'AudioRecorder',
      duration,
      hasPermission
    });
  };

  const cleanup = () => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }

    if (mediaRecorder.current) {
      mediaRecorder.current.removeEventListener('dataavailable', handleDataAvailable);
      mediaRecorder.current.removeEventListener('error', handleRecordingError);
      mediaRecorder.current.removeEventListener('stop', handleRecordingStop);
      
      const tracks = mediaRecorder.current.stream?.getTracks();
      tracks?.forEach(track => track.stop());
    }
  };

  const handleRetry = () => {
    setError(null);
    setAudioBlob(null);
    setDuration(0);
    checkPermissions();
  };

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ mb: 2 }}
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={handleRetry}
            title="Try again"
          >
            <RefreshIcon />
          </IconButton>
        }
      >
        <AlertTitle>Recording Error</AlertTitle>
        {error.message}
      </Alert>
    );
  }

  if (hasPermission === false) {
    return (
      <Alert 
        severity="warning"
        sx={{ mb: 2 }}
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={handleRetry}
            title="Check permissions again"
          >
            <RefreshIcon />
          </IconButton>
        }
      >
        <AlertTitle>Microphone Access Required</AlertTitle>
        Please enable microphone access in your browser settings to use this feature.
      </Alert>
    );
  }

  return (
    <AudioErrorBoundary onRetry={handleRetry}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color={isRecording ? 'error' : 'primary'}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={hasPermission === false}
              size="large"
            >
              {isRecording ? <StopIcon /> : <MicIcon />}
            </IconButton>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {isRecording ? 'Recording...' : 'Click to record'}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(duration / maxDuration) * 100}
                sx={{ 
                  visibility: isRecording ? 'visible' : 'hidden',
                  '& .MuiLinearProgress-bar': {
                    transition: 'none'
                  }
                }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary">
              {duration}s / {maxDuration}s
            </Typography>
          </Box>

          {audioBlob && (
            <Box sx={{ mt: 2 }}>
              <audio src={URL.createObjectURL(audioBlob)} controls />
            </Box>
          )}
        </CardContent>
      </Card>
    </AudioErrorBoundary>
  );
};

export default AudioRecorder; 