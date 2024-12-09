import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Grid,
  Chip,
  Dialog,
  Badge,
  useTheme,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  LocalFireDepartment as StreakIcon,
  Bolt as PowerUpIcon,
  VolumeUp as SpeakIcon
} from '@mui/icons-material';
import ErrorBoundary from './ErrorBoundary';
import { errorReportingService, NetworkError } from '../services/error/errorReportingService';

import { PronunciationGameSession, gameConfig } from '../services/gamification/pronunciationGame';

// Custom error boundary for game components
const GameErrorBoundary = ({ children }) => (
  <ErrorBoundary
    fallback={(error, reset) => (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Game Error
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {error instanceof NetworkError 
            ? 'Connection lost. Please check your internet connection.'
            : 'Game encountered an error. Please try again.'}
        </Typography>
        <Button variant="contained" onClick={reset}>
          Restart Game
        </Button>
      </Box>
    )}
  >
    {children}
  </ErrorBoundary>
);

const PronunciationGame = ({ userId, onComplete }) => {
  const theme = useTheme();
  const [gameSession, setGameSession] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [lastAchievement, setLastAchievement] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const handleError = async (error) => {
    setError(error.message);
    
    if (error instanceof NetworkError && retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      await initializeGame(); // Retry initialization
    } else {
      errorReportingService.reportError(error, null, {
        component: 'PronunciationGame',
        userId,
        retryCount
      });
    }
  };

  const initializeGame = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check network connection
      if (!navigator.onLine) {
        throw new NetworkError('No internet connection');
      }

      // Initialize game session
      const session = new PronunciationGameSession(userId);
      setGameSession(session);
      
      // Reset retry count on successful initialization
      setRetryCount(0);
    } catch (error) {
      await handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeGame();
  }, [userId]);

  useEffect(() => {
    // Timer for challenges
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const startChallenge = (challengeType) => {
    const challenge = gameSession.startChallenge(challengeType);
    setCurrentChallenge(challenge);
    setTimeLeft(challenge.timeLimit);
  };

  const handlePowerUp = async (powerUpId) => {
    try {
      if (!gameSession) throw new Error('Game session not initialized');
      
      if (gameSession.usePowerUp(powerUpId)) {
        setGameSession({ ...gameSession });
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleAchievement = (achievement) => {
    setLastAchievement(achievement);
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 3000);
  };

  const renderGameHeader = () => (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TrophyIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">
          Level: {gameSession?.level}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Badge badgeContent={gameSession?.streak} color="secondary">
          <StreakIcon color="primary" />
        </Badge>
        <Typography variant="h6" sx={{ ml: 1 }}>
          Score: {gameSession?.score}
        </Typography>
      </Box>
    </Box>
  );

  const renderChallenges = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {Object.entries(gameConfig.challenges).map(([type, challenge]) => (
        <Grid item xs={12} sm={6} key={type}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              '&:hover': { boxShadow: 6 }
            }}
            onClick={() => startChallenge(type)}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {challenge.type.replace('_', ' ').toUpperCase()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TimerIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {challenge.timeLimit} seconds
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {challenge.type === 'rapid_words' 
                  ? `Complete ${challenge.targetWords} words`
                  : `Score up to ${challenge.points.perfect} points`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderPowerUps = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Power-ups
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {Object.entries(gameConfig.powerUps).map(([id, powerUp]) => (
          <Chip
            key={id}
            icon={<PowerUpIcon />}
            label={`${powerUp.name} (${powerUp.cost})`}
            onClick={() => handlePowerUp(id)}
            disabled={gameSession?.score < powerUp.cost}
            sx={{ '& .MuiChip-icon': { fontSize: 16 } }}
          />
        ))}
      </Box>
    </Box>
  );

  const renderCurrentChallenge = () => {
    if (!currentChallenge) return null;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              Current Challenge
            </Typography>
            <Typography variant="h6" color="primary">
              {timeLeft}s
            </Typography>
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={(timeLeft / currentChallenge.timeLimit) * 100}
            sx={{ mb: 2, height: 8, borderRadius: 4 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<SpeakIcon />}
              size="large"
            >
              Speak Now
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderAchievementPopup = () => (
    <Dialog
      open={showAchievement}
      onClose={() => setShowAchievement(false)}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <StarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Achievement Unlocked!
        </Typography>
        <Typography variant="h6" color="primary">
          {lastAchievement?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {lastAchievement?.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          +{lastAchievement?.points} points
        </Typography>
      </Box>
    </Dialog>
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
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
          <Button color="inherit" size="small" onClick={initializeGame}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (!gameSession) return null;

  return (
    <GameErrorBoundary>
      <Box>
        {renderGameHeader()}
        {renderPowerUps()}
        {currentChallenge ? renderCurrentChallenge() : renderChallenges()}
        {renderAchievementPopup()}
      </Box>
    </GameErrorBoundary>
  );
};

export default PronunciationGame; 