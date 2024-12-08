import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Box,
  Alert
} from '@mui/material';

// Sample grammar exercises - in a real app, this would come from an API
const grammarExercises = [
  {
    question: 'Choose the correct form of the verb:',
    sentence: 'She _____ to the store yesterday.',
    options: ['go', 'goes', 'went', 'gone'],
    correctAnswer: 'went',
    explanation: 'We use the past simple tense (went) for completed actions in the past.'
  },
  {
    question: 'Select the correct article:',
    sentence: 'I saw _____ elephant at the zoo.',
    options: ['a', 'an', 'the', 'no article'],
    correctAnswer: 'an',
    explanation: 'We use "an" before words that begin with a vowel sound.'
  },
  {
    question: 'Choose the correct preposition:',
    sentence: 'The book is _____ the table.',
    options: ['in', 'on', 'at', 'by'],
    correctAnswer: 'on',
    explanation: 'We use "on" for objects that are supported by a surface.'
  }
];

function Grammar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % grammarExercises.length);
    setSelectedAnswer('');
    setShowResult(false);
  };

  const currentExercise = grammarExercises[currentIndex];
  const isCorrect = selectedAnswer === currentExercise.correctAnswer;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Grammar Practice
      </Typography>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {currentExercise.question}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {currentExercise.sentence}
          </Typography>

          <FormControl component="fieldset">
            <RadioGroup value={selectedAnswer} onChange={handleAnswerChange}>
              {currentExercise.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled={showResult}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {showResult && (
            <Box sx={{ mt: 3 }}>
              <Alert severity={isCorrect ? 'success' : 'error'}>
                {isCorrect ? 'Correct!' : 'Incorrect. Try again!'}
              </Alert>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {currentExercise.explanation}
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            {!showResult ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!selectedAnswer}
              >
                Check Answer
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next Question
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Question {currentIndex + 1} of {grammarExercises.length}
        </Typography>
      </Box>
    </Container>
  );
}

export default Grammar; 