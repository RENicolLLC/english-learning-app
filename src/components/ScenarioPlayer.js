import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  VolumeUp as VolumeUpIcon,
  Translate as TranslateIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const ScenarioPlayer = ({ scenario, userLanguage, onComplete }) => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showCulturalNote, setShowCulturalNote] = useState(false);
  const [userChoices, setUserChoices] = useState({});
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [showExercise, setShowExercise] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate progress
    const totalSteps = scenario.content.dialogue.length;
    setProgress((currentStep / totalSteps) * 100);
  }, [currentStep, scenario]);

  const handleNext = () => {
    if (currentStep < scenario.content.dialogue.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setShowExercise(true);
  };

  const playAudio = (audioUrl) => {
    setAudioPlaying(true);
    const audio = new Audio(audioUrl);
    audio.onended = () => setAudioPlaying(false);
    audio.play();
  };

  const handleChoice = (choiceIndex, option) => {
    setUserChoices(prev => ({
      ...prev,
      [choiceIndex]: option
    }));

    // Check if this choice has consequences
    const choice = scenario.interactions.userChoices[choiceIndex];
    if (choice.consequences?.followUpQuestions?.[option]) {
      // Handle follow-up
    }
  };

  const renderDialogue = () => {
    const currentDialogue = scenario.content.dialogue[currentStep];
    
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', mr: 1 }}>
              {currentDialogue.speaker}:
            </Typography>
            {currentDialogue.audioUrl && (
              <IconButton 
                onClick={() => playAudio(currentDialogue.audioUrl)}
                disabled={audioPlaying}
                size="small"
              >
                <VolumeUpIcon />
              </IconButton>
            )}
          </Box>

          <Typography variant="body1" paragraph>
            {currentDialogue.text}
          </Typography>

          {showTranslation && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {currentDialogue.translations[userLanguage]}
            </Typography>
          )}

          {currentDialogue.notes && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Tip: {currentDialogue.notes}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderExercises = () => (
    <Dialog open={showExercise} fullWidth maxWidth="md">
      <DialogTitle>
        Practice Exercises
        <IconButton
          onClick={() => {
            setShowExercise(false);
            onComplete();
          }}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          {/* Vocabulary Section */}
          <Typography variant="h6" gutterBottom>Vocabulary</Typography>
          <Grid container spacing={2}>
            {scenario.content.exercises.vocabulary.map((vocab, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" color="primary">
                    {vocab.term}
                  </Typography>
                  <Typography variant="body2">
                    {vocab.definition}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Example: {vocab.usage}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Grammar Section */}
          <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>Grammar</Typography>
          {scenario.content.exercises.grammar.map((grammar, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="primary">
                {grammar.pattern}
              </Typography>
              <Typography variant="body2">
                {grammar.explanation}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {grammar.examples.map((example, i) => (
                  <Chip 
                    key={i}
                    label={example}
                    sx={{ mr: 1, mt: 1 }}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          ))}

          {/* Comprehension Questions */}
          <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
            Comprehension Check
          </Typography>
          {scenario.content.exercises.comprehension.map((question, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="subtitle1">
                {question.question}
              </Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {question.options.map((option, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleChoice(index, option)}
                      color={userChoices[index] === option ? 
                        (option === question.correctAnswer ? 'success' : 'error') 
                        : 'primary'}
                    >
                      {option}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              {userChoices[index] && (
                <Typography 
                  variant="body2" 
                  color={userChoices[index] === question.correctAnswer ? 'success.main' : 'error.main'}
                  sx={{ mt: 1 }}
                >
                  {question.explanation}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );

  return (
    <Box>
      {/* Progress Bar */}
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ mb: 2, height: 8, borderRadius: 4 }}
      />

      {/* Main Content */}
      <Box sx={{ mb: 3 }}>
        {renderDialogue()}
      </Box>

      {/* Control Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="outlined"
        >
          Back
        </Button>
        <Box>
          <IconButton 
            onClick={() => setShowTranslation(!showTranslation)}
            color={showTranslation ? 'primary' : 'default'}
            sx={{ mr: 1 }}
          >
            <TranslateIcon />
          </IconButton>
          <IconButton 
            onClick={() => setShowCulturalNote(!showCulturalNote)}
            color={showCulturalNote ? 'primary' : 'default'}
            sx={{ mr: 1 }}
          >
            <InfoIcon />
          </IconButton>
        </Box>
        <Button
          onClick={handleNext}
          variant="contained"
          endIcon={currentStep === scenario.content.dialogue.length - 1 ? <CheckCircleIcon /> : null}
        >
          {currentStep === scenario.content.dialogue.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </Box>

      {/* Cultural Notes Dialog */}
      <Dialog 
        open={showCulturalNote} 
        onClose={() => setShowCulturalNote(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cultural Notes</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            {scenario.content.culturalNotes.relevance}
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2 }}>Tips:</Typography>
          {scenario.content.culturalNotes.tips.map((tip, index) => (
            <Typography key={index} variant="body2" sx={{ mt: 1 }}>
              • {tip}
            </Typography>
          ))}

          <Typography variant="h6" sx={{ mt: 2 }}>Common Mistakes to Avoid:</Typography>
          {scenario.content.culturalNotes.commonMistakes.map((mistake, index) => (
            <Typography key={index} variant="body2" sx={{ mt: 1 }}>
              • {mistake}
            </Typography>
          ))}
        </DialogContent>
      </Dialog>

      {/* Exercises Dialog */}
      {renderExercises()}
    </Box>
  );
};

export default ScenarioPlayer; 