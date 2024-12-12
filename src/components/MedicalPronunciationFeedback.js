import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Button,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  ArrowForward as ArrowForwardIcon,
  Lightbulb as LightbulbIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

const MedicalPronunciationFeedback = ({ feedback, userLanguage, onPractice }) => {
  const theme = useTheme();

  const getScoreColor = (score) => {
    if (score >= 0.9) return theme.palette.success.main;
    if (score >= 0.7) return theme.palette.info.main;
    if (score >= 0.5) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getScoreIcon = (score) => {
    if (score >= 0.9) return <CheckCircleIcon color="success" />;
    if (score >= 0.7) return <CheckCircleIcon color="info" />;
    if (score >= 0.5) return <WarningIcon color="warning" />;
    return <ErrorIcon color="error" />;
  };

  const renderCategoryScore = (category, score) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {category}
        </Typography>
        <Typography variant="body2" sx={{ color: getScoreColor(score), ml: 2 }}>
          {Math.round(score * 100)}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={score * 100}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: theme.palette.grey[200],
          '& .MuiLinearProgress-bar': {
            backgroundColor: getScoreColor(score),
            borderRadius: 4
          }
        }}
      />
    </Box>
  );

  const renderStrengths = () => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Strengths</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <List dense>
          {feedback.strengths.map((strength, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary={strength.category}
                secondary={strength.message}
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );

  const renderImprovements = () => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LightbulbIcon color="warning" sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Areas for Improvement</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <List dense>
          {feedback.improvements.map((improvement, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText
                primary={improvement.category}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {improvement.message}
                    </Typography>
                    {improvement.languageSpecific && (
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ mt: 1 }}
                      >
                        Tip for {userLanguage.toUpperCase()} speakers:
                        {improvement.languageSpecific}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );

  const renderNextSteps = () => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon color="info" sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Recommended Practice</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {feedback.nextSteps.map((step, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                {step.type.toUpperCase()} Practice
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                Exercises:
              </Typography>
              <List dense>
                {step.exercises.map((exercise, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>
                      <ArrowForwardIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={exercise} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 1 }} />

              <Typography variant="body2" gutterBottom>
                Resources:
              </Typography>
              <Box sx={{ mt: 1 }}>
                {step.resources.map((resource, i) => (
                  <Chip
                    key={i}
                    label={resource}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onPractice}
            endIcon={<ArrowForwardIcon />}
          >
            Start Practice Exercises
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Overall Pronunciation Score
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            {getScoreIcon(feedback.overallScore)}
            <Box sx={{ flexGrow: 1, mx: 2 }}>
              <LinearProgress
                variant="determinate"
                value={feedback.overallScore * 100}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getScoreColor(feedback.overallScore),
                    borderRadius: 6
                  }
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{ color: getScoreColor(feedback.overallScore) }}
            >
              {Math.round(feedback.overallScore * 100)}%
            </Typography>
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Category Scores:
          </Typography>
          {Object.entries(feedback.categoryScores).map(([category, score]) => (
            renderCategoryScore(category, score)
          ))}
        </CardContent>
      </Card>

      {renderStrengths()}
      {renderImprovements()}
      {renderNextSteps()}
    </Box>
  );
};

export default MedicalPronunciationFeedback; 