import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Paper,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Fade
} from '@mui/material';
import {
  VolumeUp as VolumeUpIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon
} from '@mui/icons-material';
import { useAuth } from '../services/auth/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';

// Spaced repetition intervals in hours
const REPETITION_INTERVALS = [1, 4, 8, 24, 72, 168, 336, 720];

function Vocabulary() {
  const theme = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [reviewMode, setReviewMode] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        setLoading(true);
        // Fetch vocabulary words based on user's level
        const response = await fetch(`/api/vocabulary?level=${user.learning_level}`);
        const data = await response.json();
        setWords(data.words);
        setUserProgress(data.progress);
      } catch (err) {
        setError('Failed to load vocabulary. Please try again.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, [user.learning_level]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setShowAnswer(false);
    setCurrentWordIndex(0);
  };

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const handleAnswer = async (correct) => {
    try {
      const word = words[currentWordIndex];
      const progress = userProgress[word.id] || {
        correctCount: 0,
        incorrectCount: 0,
        lastReviewed: null,
        nextReview: null,
        level: 0
      };

      // Update progress
      if (correct) {
        progress.correctCount++;
        progress.level = Math.min(progress.level + 1, REPETITION_INTERVALS.length - 1);
      } else {
        progress.incorrectCount++;
        progress.level = Math.max(progress.level - 1, 0);
      }

      progress.lastReviewed = new Date().toISOString();
      progress.nextReview = new Date(Date.now() + REPETITION_INTERVALS[progress.level] * 3600000).toISOString();

      // Save progress
      await fetch('/api/vocabulary/progress', {
        method: 'POST',
        body: JSON.stringify({
          wordId: word.id,
          progress
        })
      });

      // Update local state
      setUserProgress(prev => ({
        ...prev,
        [word.id]: progress
      }));

      // Move to next word
      handleNext();
    } catch (err) {
      setError('Failed to save progress. Please try again.');
    }
  };

  const playAudio = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  const currentWord = words[currentWordIndex];
  const progress = currentWord ? userProgress[currentWord.id] : null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Vocabulary Practice
        </Typography>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Learn New Words" />
            <Tab label="Review" />
            <Tab label="Mastered" />
          </Tabs>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ErrorBoundary>
            <Card
              sx={{
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {currentWord && (
                <>
                  <LinearProgress
                    variant="determinate"
                    value={(currentWordIndex / words.length) * 100}
                    sx={{ position: 'absolute', top: 0, width: '100%' }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                      <Typography variant="h3" component="h2" gutterBottom>
                        {currentWord.word}
                        <IconButton onClick={() => playAudio(currentWord.word)} size="large">
                          <VolumeUpIcon />
                        </IconButton>
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                        {currentWord.phonetic}
                      </Typography>
                      {progress && (
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={`Level ${progress.level + 1}`}
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={`${progress.correctCount} correct`}
                            color="success"
                            size="small"
                          />
                        </Box>
                      )}
                    </Box>

                    <Fade in={showAnswer}>
                      <Box sx={{ textAlign: 'center', width: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                          {currentWord.definition}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" paragraph>
                          {currentWord.example}
                        </Typography>
                        {currentWord.synonyms && (
                          <Typography variant="body2" color="textSecondary">
                            Synonyms: {currentWord.synonyms.join(', ')}
                          </Typography>
                        )}
                      </Box>
                    </Fade>
                  </CardContent>

                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      startIcon={<PrevIcon />}
                      onClick={handlePrevious}
                      disabled={currentWordIndex === 0}
                    >
                      Previous
                    </Button>
                    {!showAnswer ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowAnswer(true)}
                      >
                        Show Answer
                      </Button>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckIcon />}
                          onClick={() => handleAnswer(true)}
                        >
                          I knew this
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<CloseIcon />}
                          onClick={() => handleAnswer(false)}
                        >
                          Still learning
                        </Button>
                      </Box>
                    )}
                    <Button
                      endIcon={<NextIcon />}
                      onClick={handleNext}
                      disabled={currentWordIndex === words.length - 1}
                    >
                      Next
                    </Button>
                  </Box>
                </>
              )}
            </Card>
          </ErrorBoundary>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Words Mastered
                </Typography>
                <Typography variant="h4">
                  {Object.values(userProgress).filter(p => p.level >= 5).length}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Current Streak
                </Typography>
                <Typography variant="h4">
                  {user.vocabulary_streak || 0} days
                </Typography>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setStatsOpen(true)}
              >
                View Detailed Stats
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stats Dialog */}
      <Dialog
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Learning Statistics
          <IconButton
            onClick={() => setStatsOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4">
                  {words.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Words
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4">
                  {Object.values(userProgress).reduce((sum, p) => sum + p.correctCount, 0)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Correct Answers
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4">
                  {Object.values(userProgress).filter(p => p.level >= 5).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Words Mastered
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Vocabulary; 