import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VocabularyIcon from '@mui/icons-material/Book';
import GrammarIcon from '@mui/icons-material/Rule';
import ProgressIcon from '@mui/icons-material/Timeline';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Vocabulary Practice',
      description: 'Build your English vocabulary through interactive exercises and flashcards.',
      icon: <VocabularyIcon sx={{ fontSize: 40 }} />,
      path: '/vocabulary'
    },
    {
      title: 'Grammar Exercises',
      description: 'Master English grammar with our comprehensive practice modules.',
      icon: <GrammarIcon sx={{ fontSize: 40 }} />,
      path: '/grammar'
    },
    {
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking.',
      icon: <ProgressIcon sx={{ fontSize: 40 }} />,
      path: '/progress'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Welcome to English Learning
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph align="center">
        Start your journey to English mastery today
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                {feature.icon}
                <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate(feature.path)}
                >
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home; 