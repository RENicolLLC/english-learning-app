import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Box
} from '@mui/material';

// Sample progress data - in a real app, this would come from an API
const progressData = {
  vocabulary: {
    completed: 45,
    total: 100,
    streak: 7,
    lastPracticed: '2023-12-08'
  },
  grammar: {
    completed: 30,
    total: 75,
    streak: 5,
    lastPracticed: '2023-12-07'
  }
};

function Progress() {
  const calculateProgress = (completed, total) => (completed / total) * 100;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Your Progress
      </Typography>

      <Grid container spacing={4}>
        {/* Vocabulary Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Vocabulary Progress
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="textSecondary">
                  Words Mastered
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateProgress(progressData.vocabulary.completed, progressData.vocabulary.total)} 
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="textSecondary">
                      {progressData.vocabulary.completed}/{progressData.vocabulary.total}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body1">
                  Current Streak: {progressData.vocabulary.streak} days
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Last practiced: {progressData.vocabulary.lastPracticed}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Grammar Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Grammar Progress
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="textSecondary">
                  Exercises Completed
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateProgress(progressData.grammar.completed, progressData.grammar.total)} 
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="textSecondary">
                      {progressData.grammar.completed}/{progressData.grammar.total}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body1">
                  Current Streak: {progressData.grammar.streak} days
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Last practiced: {progressData.grammar.lastPracticed}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Overall Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Overall Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" align="center">
                    {progressData.vocabulary.streak + progressData.grammar.streak}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    Total Practice Days
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" align="center">
                    {progressData.vocabulary.completed + progressData.grammar.completed}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    Total Exercises Completed
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" align="center">
                    {Math.round(((progressData.vocabulary.completed + progressData.grammar.completed) / 
                      (progressData.vocabulary.total + progressData.grammar.total)) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    Overall Completion
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Progress; 