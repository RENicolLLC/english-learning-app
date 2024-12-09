import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  VolumeUp as VolumeUpIcon,
  Mic as MicIcon,
  Stop as StopIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import ErrorBoundary from './ErrorBoundary';
import { errorReportingService, AudioError, ValidationError } from '../services/error/errorReportingService';

import { pronunciationGuides, pronunciationAudio } from '../services/vocabulary/medicalPronunciation';

// Audio-specific error boundary
const AudioErrorBoundary = ({ children }) => (
  <ErrorBoundary
    fallback={(error, reset) => (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error instanceof AudioError ? 'Audio Processing Error' : 'Pronunciation Practice Error'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {error instanceof AudioError 
            ? 'There was a problem with your microphone or audio processing. Please check your device settings.'
            : 'An error occurred during pronunciation practice. Please try again.'}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => {
              navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => reset())
                .catch(() => alert('Please enable microphone access'));
            }}
          >
            Check Microphone
          </Button>
          <Button variant="outlined" onClick={reset}>
            Try Again
          </Button>
        </Box>
      </Box>
    )}
  >
    {children}
  </ErrorBoundary>
);

const MedicalPronunciationPractice = ({ term, category, onComplete }) => {
  const theme = useTheme();
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const guide = pronunciationGuides[category]?.[term];

  useEffect(() => {
    return () => {
      // Cleanup audio stream on unmount
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioStream]);

  const initializeAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
    } catch (error) {
      throw new AudioError('Failed to access microphone: ' + error.message);
    }
  };

  const handlePlay = async () => {
    setIsPlaying(true);
    await pronunciationAudio.play(term);
    setIsPlaying(false);
  };

  const handleStartRecording = async () => {
    try {
      setError(null);
      if (!audioStream) {
        await initializeAudio();
      }
      setIsRecording(true);
      const recording = await pronunciationAudio.record();
      setRecordedAudio(recording);
      setIsRecording(false);
    } catch (error) {
      setError(error.message);
      errorReportingService.reportError(error, null, {
        component: 'MedicalPronunciationPractice',
        action: 'startRecording',
        term,
        category
      });
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      // ... process recording
    } catch (error) {
      setError(error.message);
      errorReportingService.reportError(error, null, {
        component: 'MedicalPronunciationPractice',
        action: 'stopRecording',
        term,
        category
      });
    }
  };

  const handleCompare = async () => {
    if (recordedAudio) {
      const result = await pronunciationAudio.compare(term, recordedAudio);
      setComparisonResult(result);
      setFeedback(result.feedback);
    }
  };

  const renderPronunciationGuide = () => (
    <Dialog open={showGuide} onClose={() => setShowGuide(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Pronunciation Guide: {term}</DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <ListItemText
              primary="IPA"
              secondary={guide.ipa}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Syllables"
              secondary={guide.syllables}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Stress"
              secondary={guide.stress}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Tips"
              secondary={
                <List dense>
                  {guide.tips.map((tip, index) => (
                    <ListItem key={index}>
                      <ListItemText secondary={`• ${tip}`} />
                    </ListItem>
                  ))}
                </List>
              }
            />
          </ListItem>
          {guide.commonErrors && (
            <ListItem>
              <ListItemText
                primary="Common Errors"
                secondary={
                  <List dense>
                    {Object.entries(guide.commonErrors).map(([lang, error]) => (
                      <ListItem key={lang}>
                        <ListItemText secondary={`${lang.toUpperCase()}: ${error}`} />
                      </ListItem>
                    ))}
                  </List>
                }
              />
            </ListItem>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ mb: 2 }}
        action={
          <Button color="inherit" size="small" onClick={() => setError(null)}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <AudioErrorBoundary>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {term}
            </Typography>
            <IconButton
              onClick={() => setShowGuide(true)}
              color="primary"
              sx={{ mr: 1 }}
            >
              <InfoIcon />
            </IconButton>
            <IconButton
              onClick={handlePlay}
              disabled={isPlaying}
              color="primary"
            >
              <VolumeUpIcon />
            </IconButton>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Chip
              label={guide.ipa}
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label={guide.syllables}
              variant="outlined"
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button
              variant="contained"
              color={isRecording ? "error" : "primary"}
              startIcon={isRecording ? <StopIcon /> : <MicIcon />}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
          </Box>

          {recordedAudio && !comparisonResult && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCompare}
              >
                Compare with Original
              </Button>
            </Box>
          )}

          {comparisonResult && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Pronunciation Score:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={comparisonResult.score * 100}
                  sx={{ flexGrow: 1, mr: 2, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2">
                  {Math.round(comparisonResult.score * 100)}%
                </Typography>
              </Box>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Feedback:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feedback.split('\n').map((line, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    {line.startsWith('-') ? (
                      <>
                        <Typography component="span" sx={{ ml: 2 }}>•</Typography>
                        <Typography component="span" sx={{ ml: 1 }}>{line.substring(2)}</Typography>
                      </>
                    ) : (
                      line
                    )}
                  </Box>
                ))}
              </Typography>
            </Box>
          )}

          {renderPronunciationGuide()}
        </CardContent>
      </Card>
    </AudioErrorBoundary>
  );
};

export default MedicalPronunciationPractice; 