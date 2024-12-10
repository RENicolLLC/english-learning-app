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
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
  Chip,
  useTheme,
  Collapse,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { useAuth } from '../services/auth/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';

const GRAMMAR_CATEGORIES = [
  'Tenses',
  'Articles',
  'Prepositions',
  'Modal Verbs',
  'Conditionals',
  'Passive Voice',
  'Reported Speech',
  'Conjunctions'
];

function Grammar() {
  const theme = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [statsOpen, setStatsOpen] = useState(false);
  const [explanationOpen, setExplanationOpen] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        // Fetch grammar exercises based on user's level
        const response = await fetch(`/api/grammar?level=${user.learning_level}&category=${GRAMMAR_CATEGORIES[currentTab]}`);
        const data = await response.json();
        setExercises(data.exercises);
        setUserProgress(data.progress);
      } catch (err) {
        setError('Failed to load exercises. Please try again.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [user.learning_level, currentTab]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setCurrentExerciseIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowResult(false);
      setExplanationOpen(false);
    }
  };

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setSelectedAnswer('');
      setShowResult(false);
      setExplanationOpen(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const exercise = exercises[currentExerciseIndex];
      const isCorrect = selectedAnswer === exercise.correctAnswer;
      
      // Save progress
      await fetch('/api/grammar/progress', {
        method: 'POST',
        body: JSON.stringify({
          exerciseId: exercise.id,
          correct: isCorrect,
          category: GRAMMAR_CATEGORIES[currentTab]
        })
      });

      // Update local progress
      setUserProgress(prev => ({
        ...prev,
        [exercise.id]: {
          ...prev[exercise.id],
          attempts: (prev[exercise.id]?.attempts || 0) + 1,
          correct: (prev[exercise.id]?.correct || 0) + (isCorrect ? 1 : 0)
        }
      }));

      setShowResult(true);
    } catch (err) {
      setError('Failed to save progress. Please try again.');
    }
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
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];
  const progress = currentExercise ? userProgress[currentExercise.id] : null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Grammar Practice
        </Typography>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {GRAMMAR_CATEGORIES.map((category, index) => (
              <Tab key={category} label={category} />
            ))}
          </Tabs>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ErrorBoundary>
            <Card sx={{ minHeight: 400 }}>
              {currentExercise && (
                <>
                  <LinearProgress
                    variant="determinate"
                    value={(currentExerciseIndex / exercises.length) * 100}
                    sx={{ borderRadius: '4px 4px 0 0' }}
                  />
                  <CardContent>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" gutterBottom>
                        {currentExercise.question}
                      </Typography>
                      {currentExercise.context && (
                        <Typography variant="body2" color="textSecondary" paragraph>
                          Context: {currentExercise.context}
                        </Typography>
                      )}
                    </Box>

                    <FormControl component="fieldset" sx={{ width: '100%' }}>
                      <RadioGroup
                        value={selectedAnswer}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                      >
                        {currentExercise.options.map((option, index) => (
                          <FormControlLabel
                            key={index}
                            value={option}
                            control={<Radio />}
                            label={option}
                            disabled={showResult}
                            sx={{
                              ...(showResult && option === currentExercise.correctAnswer && {
                                color: theme.palette.success.main
                              }),
                              ...(showResult && selectedAnswer === option && option !== currentExercise.correctAnswer && {
                                color: theme.palette.error.main
                              })
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>

                    <Collapse in={showResult}>
                      <Box sx={{ mt: 3 }}>
                        <Alert
                          severity={selectedAnswer === currentExercise.correctAnswer ? 'success' : 'error'}
                          action={
                            <Button
                              color="inherit"
                              size="small"
                              onClick={() => setExplanationOpen(true)}
                            >
                              Learn More
                            </Button>
                          }
                        >
                          {selectedAnswer === currentExercise.correctAnswer
                            ? 'Correct! Well done!'
                            : `Incorrect. The correct answer is: ${currentExercise.correctAnswer}`}
                        </Alert>
                      </Box>
                    </Collapse>
                  </CardContent>

                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', borderTop: 1, borderColor: 'divider' }}>
                    <Button
                      startIcon={<PrevIcon />}
                      onClick={handlePrevious}
                      disabled={currentExerciseIndex === 0}
                    >
                      Previous
                    </Button>
                    {!showResult ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={!selectedAnswer}
                      >
                        Check Answer
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={currentExerciseIndex === exercises.length - 1}
                      >
                        Next Exercise
                      </Button>
                    )}
                    <Button
                      endIcon={<NextIcon />}
                      onClick={handleNext}
                      disabled={currentExerciseIndex === exercises.length - 1}
                    >
                      Skip
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
                  Exercises Completed
                </Typography>
                <Typography variant="h4">
                  {Object.keys(userProgress).length}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Success Rate
                </Typography>
                <Typography variant="h4">
                  {Object.values(userProgress).reduce((sum, p) => sum + (p.correct || 0), 0)} / {Object.values(userProgress).reduce((sum, p) => sum + (p.attempts || 0), 0)}
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

      {/* Explanation Dialog */}
      <Dialog
        open={explanationOpen}
        onClose={() => setExplanationOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Grammar Explanation
          <IconButton
            onClick={() => setExplanationOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {currentExercise && (
            <>
              <Typography variant="h6" gutterBottom>
                Rule: {currentExercise.grammarRule}
              </Typography>
              <Typography variant="body1" paragraph>
                {currentExercise.explanation}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Examples:
              </Typography>
              {currentExercise.examples.map((example, index) => (
                <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                  • {example}
                </Typography>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExplanationOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Stats Dialog */}
      <Dialog
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Grammar Statistics
          <IconButton
            onClick={() => setStatsOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {GRAMMAR_CATEGORIES.map((category) => {
              const categoryProgress = Object.values(userProgress).filter(
                p => p.category === category
              );
              const totalAttempts = categoryProgress.reduce((sum, p) => sum + (p.attempts || 0), 0);
              const correctAttempts = categoryProgress.reduce((sum, p) => sum + (p.correct || 0), 0);
              
              return (
                <Grid item xs={12} sm={6} key={category}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {category}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">
                        {totalAttempts > 0
                          ? Math.round((correctAttempts / totalAttempts) * 100)
                          : 0}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ({correctAttempts}/{totalAttempts})
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Grammar; 