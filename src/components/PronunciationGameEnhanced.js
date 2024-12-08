import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Grid,
  Chip,
  Dialog,
  Badge,
  Paper,
  Zoom,
  Grow,
  Slide,
  Fade,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Settings as SettingsIcon,
  School as LearnIcon,
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  LocalFireDepartment as StreakIcon,
  Bolt as PowerUpIcon,
  Leaderboard as LeaderboardIcon
} from '@mui/icons-material';
import { gameConfig } from '../config/gameConfig';

const LeaderboardCard = styled(Card)`
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: white;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const RewardBadge = styled(Box)`
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px;
  backdrop-filter: blur(5px);
`;

const PronunciationPractice = ({ userId, onComplete }) => {
  const theme = useTheme();
  const [gameMode, setGameMode] = useState(gameConfig.preferences.gameMode.default);
  const [selectedMode, setSelectedMode] = useState('full');
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Mode selection dialog
  const renderModeSelect = () => (
    <Dialog 
      open={showModeSelect} 
      onClose={() => setShowModeSelect(false)}
      PaperProps={{
        sx: {
          p: 3,
          minWidth: 300
        }
      }}
    >
      <Typography variant="h6" gutterBottom>
        Learning Mode
      </Typography>
      
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Select Mode</InputLabel>
        <Select
          value={selectedMode}
          onChange={(e) => {
            setSelectedMode(e.target.value);
            setGameMode(e.target.value !== 'disabled');
          }}
          label="Select Mode"
        >
          {Object.entries(gameConfig.preferences.gameMode.options).map(([key, option]) => (
            <MenuItem key={key} value={key}>
              <Box>
                <Typography variant="subtitle1">
                  {option.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button 
        fullWidth 
        variant="contained" 
        sx={{ mt: 3 }}
        onClick={() => setShowModeSelect(false)}
      >
        Save Preference
      </Button>
    </Dialog>
  );

  // Monthly leaderboard dialog
  const renderLeaderboardDialog = () => (
    <Dialog
      open={showLeaderboard}
      onClose={() => setShowLeaderboard(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          color: 'white',
          p: 3
        }
      }}
    >
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Monthly Leaderboard
        </Typography>
        <Typography variant="subtitle1">
          Top performers win subscription rewards!
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Monthly Rewards
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(gameConfig.monthlyLeaderboard.rewards).map(([place, reward]) => (
            <Grid item xs={12} sm={6} md={4} key={place}>
              <Paper sx={{ p: 2, textAlign: 'center', background: 'rgba(255,255,255,0.1)' }}>
                <Typography variant="h3" sx={{ mb: 1 }}>
                  {reward.icon}
                </Typography>
                <Typography variant="h6">
                  {getOrdinal(parseInt(place))} Place
                </Typography>
                <Typography variant="body2">
                  {reward.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Rankings
        </Typography>
        <List>
          {/* Placeholder for actual leaderboard data */}
          {[...Array(5)].map((_, index) => (
            <ListItem
              key={index}
              sx={{
                background: index === 0 ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)',
                mb: 1,
                borderRadius: 1
              }}
            >
              <ListItemText
                primary={`Player ${index + 1}`}
                secondary={`${10000 - (index * 1000)} points`}
                sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
              />
              <RewardBadge>
                {gameConfig.monthlyLeaderboard.rewards[index + 1]?.icon}
              </RewardBadge>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="rgba(255,255,255,0.7)">
          Leaderboard resets on the first day of each month
        </Typography>
      </Box>
    </Dialog>
  );

  // Basic practice interface for Focus Mode
  const renderFocusMode = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h5">
          Pronunciation Practice
        </Typography>
        <IconButton onClick={() => setShowModeSelect(true)}>
          <SettingsIcon />
        </IconButton>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Session
          </Typography>
          <Box sx={{ mt: 2 }}>
            {/* Basic progress tracking */}
            {gameConfig.preferences.progressTracking.features.map((feature) => (
              <Box key={feature} sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={0} 
                  sx={{ mt: 1 }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Practice content without game elements */}
      <Grid container spacing={3}>
        {['Words', 'Sentences', 'Conversations'].map((practice) => (
          <Grid item xs={12} sm={4} key={practice}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {practice}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LearnIcon />}
                  fullWidth
                >
                  Start Practice
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Add leaderboard button to header
  const renderGameHeader = () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <IconButton
        onClick={() => setShowLeaderboard(true)}
        sx={{ color: 'white' }}
      >
        <LeaderboardIcon />
      </IconButton>
      <IconButton onClick={() => setShowModeSelect(true)}>
        <SettingsIcon />
      </IconButton>
    </Box>
  );

  // Helper function for ordinal numbers
  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <>
      {selectedMode === 'disabled' ? renderFocusMode() : (
        // Original game interface
        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
          <Box sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            zIndex: 2 
          }}>
            <IconButton onClick={() => setShowModeSelect(true)}>
              <SettingsIcon />
            </IconButton>
          </Box>
          
          {/* Original game components */}
          {renderGameHeader()}
          {selectedMode === 'full' && renderPowerUps()}
          {currentChallenge ? renderCurrentChallenge() : renderChallenges()}
          {selectedMode === 'full' && renderAchievementPopup()}
        </Box>
      )}
      {renderModeSelect()}
      {renderLeaderboardDialog()}
    </>
  );
};

export default PronunciationPractice; 