import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Box,
  Grid
} from '@mui/material';

// Sample vocabulary data - in a real app, this would come from an API
const vocabularyWords = [
  { word: 'Ephemeral', definition: 'Lasting for a very short time', example: 'The ephemeral beauty of a sunset.' },
  { word: 'Ubiquitous', definition: 'Present everywhere', example: 'Smartphones have become ubiquitous in modern life.' },
  { word: 'Serendipity', definition: 'Finding something good without looking for it', example: 'Meeting my best friend was pure serendipity.' },
];

function Vocabulary() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % vocabularyWords.length);
    setShowDefinition(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + vocabularyWords.length) % vocabularyWords.length);
    setShowDefinition(false);
  };

  const currentWord = vocabularyWords[currentIndex];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Vocabulary Practice
      </Typography>

      <Card 
        sx={{ 
          minHeight: 300, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          cursor: 'pointer',
          mt: 4
        }}
        onClick={() => setShowDefinition(!showDefinition)}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {currentWord.word}
          </Typography>
          
          {showDefinition && (
            <>
              <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                Definition:
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {currentWord.definition}
              </Typography>
              <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                Example:
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {currentWord.example}
              </Typography>
            </>
          )}
          
          {!showDefinition && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Click to reveal definition and example
            </Typography>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        <Grid item>
          <Button 
            variant="contained" 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="contained" 
            onClick={handleNext}
            disabled={currentIndex === vocabularyWords.length - 1}
          >
            Next
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Card {currentIndex + 1} of {vocabularyWords.length}
        </Typography>
      </Box>
    </Container>
  );
}

export default Vocabulary; 