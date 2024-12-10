import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VocabularyIcon from '@mui/icons-material/Book';
import GrammarIcon from '@mui/icons-material/Rule';
import ProgressIcon from '@mui/icons-material/Timeline';
import { useAuth } from '../services/auth/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { user, loading, error } = useAuth();

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
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        {user ? `Welcome back, ${user.display_name || 'Learner'}!` : 'Welcome to English Learning'}
      </Typography>
      
      {user ? (
        <Typography variant="h5" color="textSecondary" paragraph align="center">
          Continue your learning journey
        </Typography>
      ) : (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" color="textSecondary" paragraph align="center">
            Start your journey to English mastery today
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      )}

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
                  onClick={() => {
                    if (user) {
                      navigate(feature.path);
                    } else {
                      navigate('/login', { state: { returnTo: feature.path } });
                    }
                  }}
                >
                  {user ? 'Continue Learning' : 'Get Started'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {user && (
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Your Progress
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Daily Streak</Typography>
                  <Typography variant="h3" color="primary">
                    {user.streak || 0} days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">XP Points</Typography>
                  <Typography variant="h3" color="primary">
                    {user.xp || 0} XP
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default Home; 