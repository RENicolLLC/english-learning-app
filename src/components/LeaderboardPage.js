import React, { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  History as HistoryIcon,
  Stars as StarsIcon,
  Group as GroupIcon,
  FilterList as FilterIcon,
  Info as InfoIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledLeaderCard = styled(Card)(({ theme, rank }) => ({
  position: 'relative',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  background: rank === 1 
    ? 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)'
    : rank === 2
    ? 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 100%)'
    : rank === 3
    ? 'linear-gradient(135deg, #FFA07A 0%, #CD7F32 100%)'
    : theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)'
    : 'linear-gradient(135deg, #ECF0F1 0%, #BDC3C7 100%)',
  color: rank <= 3 || theme.palette.mode === 'dark' ? 'white' : 'inherit',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[15]
  }
}));

const ColorfulBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #1A237E 0%, #311B92 50%, #4A148C 100%)'
    : 'linear-gradient(45deg, #2196F3 0%, #00BCD4 50%, #4CAF50 100%)',
  opacity: 0.1,
  zIndex: -1
}));

const GlowingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
  textShadow: theme.palette.mode === 'dark'
    ? '0 0 10px rgba(255,255,255,0.5)'
    : '0 0 10px rgba(33,150,243,0.5)',
}));

const RankBadge = styled(Box)(({ theme, rank }) => ({
  position: 'absolute',
  top: -15,
  left: -15,
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: rank === 1 
    ? '#FFD700'
    : rank === 2
    ? '#C0C0C0'
    : rank === 3
    ? '#CD7F32'
    : theme.palette.grey[300],
  border: `2px solid ${theme.palette.background.paper}`,
  color: rank <= 3 ? 'white' : theme.palette.text.primary,
  fontWeight: 'bold',
  fontSize: '1.2rem',
  zIndex: 1
}));

const LeaderboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedLeague, setSelectedLeague] = useState('beginner');
  const [isDarkMode, setIsDarkMode] = useState(theme.palette.mode === 'dark');

  const leagues = {
    beginner: { 
      name: 'Beginner League', 
      levels: '1-4',
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #81C784 0%, #4CAF50 100%)'
    },
    intermediate: { 
      name: 'Intermediate League', 
      levels: '5-8',
      color: '#2196F3',
      gradient: 'linear-gradient(135deg, #64B5F6 0%, #2196F3 100%)'
    },
    advanced: { 
      name: 'Advanced League', 
      levels: '9-12',
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg, #BA68C8 0%, #9C27B0 100%)'
    }
  };

  // Mock data - replace with real data
  const leaderboardData = [
    { id: 1, name: 'John D.', points: 12500, streak: 45, rank: 1, avatar: null },
    { id: 2, name: 'Sarah M.', points: 11200, streak: 30, rank: 2, avatar: null },
    { id: 3, name: 'Mike R.', points: 10800, streak: 28, rank: 3, avatar: null },
    // ... more entries
  ];

  const renderLeaderCard = (user) => (
    <StyledLeaderCard rank={user.rank} elevation={user.rank <= 3 ? 8 : 2}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.primary.dark}15 100%)`,
          zIndex: 0
        }}
      />
      <RankBadge rank={user.rank}>
        {user.rank}
      </RankBadge>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar 
              src={user.avatar}
              sx={{ 
                width: 60, 
                height: 60,
                border: `3px solid ${theme.palette.background.paper}`
              }}
            >
              {user.name[0]}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h6" component="div">
              {user.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
              <Chip 
                icon={<TrophyIcon />} 
                label={`${user.points} pts`}
                size="small"
                color={user.rank <= 3 ? 'default' : 'primary'}
              />
              <Chip 
                icon={<TimelineIcon />} 
                label={`${user.streak} day streak`}
                size="small"
                color={user.rank <= 3 ? 'default' : 'secondary'}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </StyledLeaderCard>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <ColorfulBackground />
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4 
      }}>
        <GlowingText variant="h4" gutterBottom>
          Monthly Leaderboard
        </GlowingText>
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
              icon={<LightModeIcon />}
              checkedIcon={<DarkModeIcon />}
            />
          }
          label={isDarkMode ? "Dark Mode" : "Light Mode"}
        />
      </Box>

      <Paper 
        sx={{ 
          mb: 4,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #424242 0%, #212121 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
          boxShadow: theme.shadows[10]
        }}
      >
        <Tabs 
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{
            '& .MuiTab-root': {
              color: theme.palette.mode === 'dark' ? '#fff' : '#000',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 'bold'
              }
            }
          }}
        >
          <Tab 
            icon={<GroupIcon />} 
            label="Current"
            sx={{ 
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                color: theme.palette.primary.main
              }
            }}
          />
          <Tab icon={<HistoryIcon />} label="Historical" />
          <Tab icon={<StarsIcon />} label="Achievements" />
        </Tabs>
      </Paper>

      {currentTab === 0 && (
        <>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {Object.entries(leagues).map(([key, league]) => (
              <Chip
                key={key}
                label={league.name}
                onClick={() => setSelectedLeague(key)}
                sx={{ 
                  background: selectedLeague === key ? league.gradient : 'transparent',
                  color: selectedLeague === key ? 'white' : 'inherit',
                  borderColor: league.color,
                  '& .MuiChip-label': { 
                    fontSize: '1rem',
                    py: 1.5
                  },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
                variant={selectedLeague === key ? 'filled' : 'outlined'}
              />
            ))}
            <Tooltip title="Filter Results">
              <IconButton 
                size="small"
                sx={{ 
                  background: theme.palette.primary.main + '20',
                  '&:hover': {
                    background: theme.palette.primary.main + '40'
                  }
                }}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Grid container spacing={3}>
            {leaderboardData.map((user) => (
              <Grid item xs={12} key={user.id}>
                {renderLeaderCard(user)}
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Historical Tab Content */}
      {currentTab === 1 && (
        <Typography variant="h6" sx={{ textAlign: 'center', py: 4 }}>
          Historical rankings coming soon...
        </Typography>
      )}

      {/* Achievements Tab Content */}
      {currentTab === 2 && (
        <Typography variant="h6" sx={{ textAlign: 'center', py: 4 }}>
          Achievements showcase coming soon...
        </Typography>
      )}
    </Container>
  );
};

export default LeaderboardPage; 