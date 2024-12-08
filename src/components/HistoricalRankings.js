import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  useTheme,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as TrophyIcon,
  Stars as StarsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';
import styled from '@emotion/styled';

const ColorfulContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #000428 0%, #004e92 100%)'
      : 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
    opacity: 0.1,
    zIndex: -1,
    borderRadius: theme.shape.borderRadius
  }
}));

const GradientCard = styled(Card)(({ theme, rank }) => ({
  background: rank === 1
    ? 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)'
    : rank === 2
    ? 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)'
    : rank === 3
    ? 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)'
    : theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)'
    : 'linear-gradient(135deg, #ECF0F1 0%, #BDC3C7 100%)',
  color: rank <= 3 || theme.palette.mode === 'dark' ? 'white' : 'inherit',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[15]
  }
}));

const StyledTableRow = styled(TableRow)(({ theme, rank }) => ({
  background: rank === 1
    ? 'linear-gradient(90deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.05) 100%)'
    : rank === 2
    ? 'linear-gradient(90deg, rgba(192,192,192,0.1) 0%, rgba(192,192,192,0.05) 100%)'
    : rank === 3
    ? 'linear-gradient(90deg, rgba(205,127,50,0.1) 0%, rgba(205,127,50,0.05) 100%)'
    : theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.02)'
    : 'rgba(0,0,0,0.02)',
  transition: 'transform 0.2s ease, background 0.2s ease',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(33,150,243,0.05)',
    transform: 'scale(1.01)'
  }
}));

const GlowingChip = styled(Chip)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #4A148C 0%, #311B92 100%)'
    : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
  color: 'white',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 0 10px rgba(156,39,176,0.3)'
    : '0 0 10px rgba(33,150,243,0.3)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 0 15px rgba(156,39,176,0.5)'
      : '0 0 15px rgba(33,150,243,0.5)'
  }
}));

const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: theme.palette.mode === 'dark'
    ? 'radial-gradient(circle at 50% 50%, #311B92 0%, #1A237E 50%, #000000 100%)'
    : 'radial-gradient(circle at 50% 50%, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)',
  opacity: 0.1,
  zIndex: -1
}));

const HistoricalRankings = () => {
  const theme = useTheme();
  const [timeframe, setTimeframe] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(theme.palette.mode === 'dark');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Mock historical data for past 6 months
  const historicalData = {
    monthly: {
      // Current month - 5
      '2024-01': [
        { 
          rank: 1, 
          name: 'Michael R.',
          screenName: 'DragonLearner',
          points: 15420, 
          league: 'advanced',
          achievements: ['perfect_month', 'streak_master'],
          reward: 'One Month Unlimited Access'
        },
        { 
          rank: 2, 
          name: 'Liu W.',
          screenName: 'LanguageSage',
          points: 14850, 
          league: 'advanced',
          achievements: ['vocabulary_master'],
          reward: 'One Week Unlimited Access'
        },
        { 
          rank: 3, 
          name: 'Sakura T.',
          screenName: 'CherryBlossom',
          points: 14200, 
          league: 'intermediate',
          achievements: ['grammar_expert'],
          reward: 'One Week Unlimited Access'
        },
        { 
          rank: 4, 
          name: 'Emma P.',
          screenName: 'SpeakEasy',
          points: 13900, 
          league: 'advanced',
          achievements: ['conversation_master'],
          reward: 'One Week Unlimited Access'
        },
        { 
          rank: 5, 
          name: 'Min-ji K.',
          screenName: 'StarLearner',
          points: 13600, 
          league: 'intermediate',
          achievements: ['quick_learner'],
          reward: 'One Week Unlimited Access'
        }
      ],
      // Current month - 4
      '2023-12': [
        { 
          rank: 1, 
          name: 'Hiroshi M.',
          screenName: 'NinjaLinguist',
          points: 16100, 
          league: 'advanced',
          achievements: ['perfect_month', 'vocabulary_master'],
          reward: 'One Month Unlimited Access'
        },
        {
          rank: 2,
          name: 'Sarah K.',
          screenName: 'LinguistPro',
          points: 15800,
          league: 'advanced',
          achievements: ['grammar_expert'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 3,
          name: 'Thanh N.',
          screenName: 'PhoenixRise',
          points: 15600,
          league: 'intermediate',
          achievements: ['fast_learner'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 4,
          name: 'Wei C.',
          screenName: 'CloudStudent',
          points: 15400,
          league: 'advanced',
          achievements: ['dedication_star'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 5,
          name: 'James T.',
          screenName: 'WordMaster',
          points: 15200,
          league: 'intermediate',
          achievements: ['consistent_learner'],
          reward: 'One Week Unlimited Access'
        }
      ],
      // Current month - 3
      '2023-11': [
        { 
          rank: 1, 
          name: 'Ji-eun P.',
          screenName: 'MoonLight',
          points: 15800, 
          league: 'intermediate',
          achievements: ['perfect_month', 'rising_star'],
          reward: 'One Month Unlimited Access'
        },
        {
          rank: 2,
          name: 'Robert N.',
          screenName: 'GrammarGuru',
          points: 15600,
          league: 'advanced',
          achievements: ['vocabulary_expert'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 3,
          name: 'Yuki S.',
          screenName: 'SnowLearner',
          points: 15400,
          league: 'intermediate',
          achievements: ['consistent_practice'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 4,
          name: 'Mai T.',
          screenName: 'SunriseStudent',
          points: 15200,
          league: 'advanced',
          achievements: ['quick_progress'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 5,
          name: 'David L.',
          screenName: 'WordWizard',
          points: 15000,
          league: 'intermediate',
          achievements: ['steady_progress'],
          reward: 'One Week Unlimited Access'
        }
      ],
      // Current month - 2
      '2023-10': [
        { 
          rank: 1, 
          name: 'Mei L.',
          screenName: 'JadeStudent',
          points: 14900, 
          league: 'advanced',
          achievements: ['perfect_month', 'pronunciation_expert'],
          reward: 'One Month Unlimited Access'
        },
        {
          rank: 2,
          name: 'Jun-ho K.',
          screenName: 'StarPath',
          points: 14700,
          league: 'intermediate',
          achievements: ['dedication_master'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 3,
          name: 'Lisa W.',
          screenName: 'SpeechMaster',
          points: 14500,
          league: 'advanced',
          achievements: ['conversation_expert'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 4,
          name: 'Anh P.',
          screenName: 'PeaceLearner',
          points: 14300,
          league: 'intermediate',
          achievements: ['steady_progress'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 5,
          name: 'Ryu T.',
          screenName: 'DragonPath',
          points: 14100,
          league: 'advanced',
          achievements: ['quick_learner'],
          reward: 'One Week Unlimited Access'
        }
      ],
      // Current month - 1
      '2023-09': [
        { 
          rank: 1, 
          name: 'Seo-yeon K.',
          screenName: 'BrightStar',
          points: 15300, 
          league: 'advanced',
          achievements: ['perfect_month', 'cultural_expert'],
          reward: 'One Month Unlimited Access'
        },
        {
          rank: 2,
          name: 'Thomas B.',
          screenName: 'PolyglotPro',
          points: 15100,
          league: 'intermediate',
          achievements: ['fast_progress'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 3,
          name: 'Haruki N.',
          screenName: 'OceanWave',
          points: 14900,
          league: 'advanced',
          achievements: ['dedication_star'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 4,
          name: 'Lin C.',
          screenName: 'MountainLearner',
          points: 14700,
          league: 'intermediate',
          achievements: ['steady_progress'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 5,
          name: 'Maria S.',
          screenName: 'SunLight',
          points: 14500,
          league: 'advanced',
          achievements: ['quick_learner'],
          reward: 'One Week Unlimited Access'
        }
      ],
      // Current month
      '2023-08': [
        { 
          rank: 1, 
          name: 'Hiro K.',
          screenName: 'MountainSpirit',
          points: 15600, 
          league: 'intermediate',
          achievements: ['perfect_month', 'fast_learner'],
          reward: 'One Month Unlimited Access'
        },
        {
          rank: 2,
          name: 'Jennifer L.',
          screenName: 'LangLearner',
          points: 15400,
          league: 'advanced',
          achievements: ['vocabulary_master'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 3,
          name: 'Minh T.',
          screenName: 'RiverFlow',
          points: 15200,
          league: 'intermediate',
          achievements: ['consistent_practice'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 4,
          name: 'Yue W.',
          screenName: 'MoonPath',
          points: 15000,
          league: 'advanced',
          achievements: ['dedication_star'],
          reward: 'One Week Unlimited Access'
        },
        {
          rank: 5,
          name: 'Ji-won P.',
          screenName: 'SkyLearner',
          points: 14800,
          league: 'intermediate',
          achievements: ['steady_progress'],
          reward: 'One Week Unlimited Access'
        }
      ]
    },
    yearly: [
      {
        rank: 1,
        name: 'Sarah K.',
        screenName: 'LinguistPro',
        totalPoints: 150000,
        averageRank: 2.3,
        topAchievements: ['year_champion', 'consistency_master'],
        reward: 'Lifetime Achievement Badge'
      }
      // ... existing yearly entries
    ]
  };

  // Add name display toggle
  const [showScreenNames, setShowScreenNames] = useState(false);

  const getDisplayName = (entry) => {
    return showScreenNames && entry.screenName ? entry.screenName : entry.name;
  };

  const renderMonthlyView = () => (
    <ColorfulContainer>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Switch
              checked={showScreenNames}
              onChange={(e) => setShowScreenNames(e.target.checked)}
            />
          }
          label="Show Screen Names"
        />
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
      <TableContainer 
        component={Paper}
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1A237E 0%, #0D47A1 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
          boxShadow: theme.shadows[10]
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'inherit' }}>
                Rank
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Points</TableCell>
              <TableCell>League</TableCell>
              <TableCell>Achievements</TableCell>
              <TableCell>Reward</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historicalData.monthly[`${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`]?.map((entry) => (
              <StyledTableRow 
                key={entry.rank}
                rank={entry.rank}
              >
                <TableCell>
                  <GlowingChip
                    size="small"
                    label={`#${entry.rank}`}
                  />
                </TableCell>
                <TableCell>{getDisplayName(entry)}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <TrophyIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
                    {entry.points.toLocaleString()}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={entry.league.charAt(0).toUpperCase() + entry.league.slice(1)}
                    color="info"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {entry.achievements.map((achievement) => (
                      <Chip
                        key={achievement}
                        size="small"
                        icon={<StarsIcon />}
                        label={achievement.replace('_', ' ')}
                        color="secondary"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{entry.reward}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ColorfulContainer>
  );

  const renderYearlyView = () => (
    <Grid container spacing={3}>
      {historicalData.yearly.map((entry) => (
        <Grid item xs={12} md={6} key={entry.rank}>
          <GradientCard rank={entry.rank}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  #{entry.rank} {entry.name}
                </Typography>
                <Chip
                  icon={<TrophyIcon />}
                  label={`${entry.totalPoints.toLocaleString()} pts`}
                  color={entry.rank <= 3 ? 'primary' : 'default'}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Average Rank: {entry.averageRank}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {entry.topAchievements.map((achievement) => (
                  <Chip
                    key={achievement}
                    size="small"
                    icon={<StarsIcon />}
                    label={achievement.replace('_', ' ')}
                    color="secondary"
                  />
                ))}
              </Box>

              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 2,
                  color: entry.rank === 1 ? 'white' : 'text.secondary'
                }}
              >
                Reward: {entry.reward}
              </Typography>
            </CardContent>
          </GradientCard>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      <AnimatedBackground />
      <Box>
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              label="Timeframe"
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>

          {timeframe === 'monthly' && (
            <>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  label="Month"
                >
                  {months.map((month, index) => (
                    <MenuItem key={month} value={index}>{month}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>League</InputLabel>
                <Select
                  value={selectedLeague}
                  onChange={(e) => setSelectedLeague(e.target.value)}
                  label="League"
                >
                  <MenuItem value="all">All Leagues</MenuItem>
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Year"
            >
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>

        {timeframe === 'monthly' ? renderMonthlyView() : renderYearlyView()}
      </Box>
    </Box>
  );
};

export default HistoricalRankings; 