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
  Chip,
  Alert,
  Paper,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  LocalHospital as MedicalIcon,
  Restaurant as RestaurantIcon,
  DirectionsTransit as TransportIcon,
  Settings as SettingsIcon,
  Bookmark as BookmarkIcon,
  CheckCircle as CompletedIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useAuth } from '../services/auth/AuthContext';
import ScenarioPlayer from '../components/ScenarioPlayer';
import ErrorBoundary from '../components/ErrorBoundary';
import { useNavigate } from 'react-router-dom';

// Category icons mapping
const categoryIcons = {
  EDUCATION: SchoolIcon,
  WORK: WorkIcon,
  MEDICAL: MedicalIcon,
  RESTAURANT: RestaurantIcon,
  TRANSPORT: TransportIcon,
};

function ScenarioPractice() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [scenarios, setScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch scenarios and user progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch scenarios based on user's level
        const response = await fetch(`/api/scenarios?level=${user.learning_level}`);
        const data = await response.json();
        setScenarios(data.scenarios);
        setUserProgress(data.progress);
      } catch (err) {
        setError('Failed to load scenarios. Please try again.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.learning_level]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleScenarioSelect = (scenario) => {
    setCurrentScenario(scenario);
    setDrawerOpen(false);
  };

  const handleScenarioComplete = async (results) => {
    try {
      // Save progress
      await fetch('/api/progress', {
        method: 'POST',
        body: JSON.stringify({
          scenarioId: currentScenario.id,
          results
        })
      });

      // Update local progress
      setUserProgress(prev => ({
        ...prev,
        completedScenarios: [...prev.completedScenarios, currentScenario.id]
      }));

      // Show completion message
      // You could add a nice completion animation here
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Scenario Practice
            </Typography>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => setDrawerOpen(true)}
            >
              Select Scenario
            </Button>
          </Box>

          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All Scenarios" />
              <Tab label="Daily Practice" />
              <Tab label="Business" />
              <Tab label="Medical" />
              <Tab label="Travel" />
            </Tabs>
          </Paper>

          {currentScenario ? (
            <ErrorBoundary>
              <ScenarioPlayer
                scenario={currentScenario}
                userLanguage={user.native_language}
                onComplete={handleScenarioComplete}
              />
            </ErrorBoundary>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" gutterBottom>
                  Select a scenario to begin practice
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Browse Scenarios
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Scenario Selection Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 340 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Available Scenarios
          </Typography>
          <List>
            {scenarios.map((scenario) => {
              const CategoryIcon = categoryIcons[scenario.category] || StarIcon;
              const isCompleted = userProgress?.completedScenarios.includes(scenario.id);

              return (
                <ListItem
                  key={scenario.id}
                  button
                  onClick={() => handleScenarioSelect(scenario)}
                  sx={{
                    mb: 1,
                    bgcolor: isCompleted ? 'action.selected' : 'background.paper',
                    borderRadius: 1
                  }}
                >
                  <ListItemIcon>
                    <CategoryIcon color={isCompleted ? 'success' : 'primary'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={scenario.title}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={`Level ${scenario.level}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        {isCompleted && (
                          <Chip
                            icon={<CompletedIcon />}
                            label="Completed"
                            size="small"
                            color="success"
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Container>
  );
}

export default ScenarioPractice; 