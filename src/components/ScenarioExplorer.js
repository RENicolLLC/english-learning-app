import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Pagination,
  Dialog,
  LinearProgress
} from '@mui/material';
import { useAuth } from '../services/auth/AuthContext';
import { scenarioService } from '../services/scenarios/scenarioService';
import { membershipTiers, educationLevels, scenarioCategories } from '../membership/membershipConfig';

const ScenarioExplorer = () => {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: 1,
    category: 'DAILY_LIFE',
    difficulty: 'normal'
  });
  const [userProgress, setUserProgress] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [page, setPage] = useState(1);
  const scenariosPerPage = 12;

  useEffect(() => {
    loadScenarios();
    loadUserProgress();
  }, [filters, page]);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const fetchedScenarios = await scenarioService.getScenarios(
        user.uid,
        filters.level,
        filters.category,
        scenariosPerPage
      );
      setScenarios(fetchedScenarios);
    } catch (error) {
      console.error('Error loading scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const progress = await scenarioService.getUserProgress(user.uid);
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(1);
  };

  const handleScenarioClick = async (scenario) => {
    try {
      const detailedScenario = await scenarioService.getScenarioById(scenario.id, user.nativeLanguage);
      setSelectedScenario(detailedScenario);
    } catch (error) {
      console.error('Error loading scenario details:', error);
    }
  };

  const renderScenarioCard = (scenario) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
      onClick={() => handleScenarioClick(scenario)}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {scenario.metadata.title}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={`Level ${scenario.metadata.level}`}
            color="primary"
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip 
            label={scenario.metadata.difficulty}
            color="secondary"
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {scenario.content.setup.context}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary">
            {scenario.content.setup.location} • {scenario.metadata.category}
          </Typography>
        </Box>

        {userProgress?.completedScenarios?.includes(scenario.id) && (
          <Box sx={{ mt: 2 }}>
            <Chip 
              label="Completed"
              color="success"
              size="small"
              variant="outlined"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderFilters = () => (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Level</InputLabel>
            <Select
              value={filters.level}
              label="Level"
              onChange={(e) => handleFilterChange('level', e.target.value)}
            >
              {Object.entries(educationLevels).map(([key, value]) => (
                value.levels.map(level => (
                  <MenuItem key={level} value={level}>
                    Level {level}
                  </MenuItem>
                ))
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {Object.keys(scenarioCategories).map(category => (
                <MenuItem key={category} value={category}>
                  {category.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={filters.difficulty}
              label="Difficulty"
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const renderProgressBar = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle1" gutterBottom>
        Level {filters.level} Progress
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={(userProgress?.levelProgress?.[filters.level] || 0) * 100}
        sx={{ height: 10, borderRadius: 5 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {userProgress?.completedScenarios?.length || 0} Completed
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Next Level: {(userProgress?.levelProgress?.[filters.level] || 0) * 100}%
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {renderFilters()}
      {renderProgressBar()}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {scenarios.map((scenario) => (
              <Grid item xs={12} sm={6} md={4} key={scenario.id}>
                {renderScenarioCard(scenario)}
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={Math.ceil(scenarios.length / scenariosPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}

      <Dialog 
        open={!!selectedScenario} 
        onClose={() => setSelectedScenario(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedScenario && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {selectedScenario.metadata.title}
            </Typography>
            {/* Add detailed scenario content here */}
          </Box>
        )}
      </Dialog>
    </Container>
  );
};

export default ScenarioExplorer; 