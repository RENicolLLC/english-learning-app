import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tooltip
} from '@mui/material';
import {
  People,
  TrendingUp,
  Star,
  Warning,
  Storage
} from '@mui/icons-material';

interface StatsCardsProps {
  stats: {
    total_users: number;
    new_users_24h: number;
    avg_level: number;
    premium_users: number;
    unlimited_users: number;
  };
  systemStats: {
    activities_24h: number;
    avg_score_24h: number;
    errors_24h: number;
    db_size: number;
  };
}

export default function StatsCards({ stats, systemStats }: StatsCardsProps) {
  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
  };

  const cards = [
    {
      title: 'Total Users',
      value: formatNumber(stats.total_users),
      icon: <People />,
      color: '#1976d2',
      subtext: `+${stats.new_users_24h} today`
    },
    {
      title: 'Premium Users',
      value: formatNumber(stats.premium_users + stats.unlimited_users),
      icon: <Star />,
      color: '#ffc107',
      subtext: `${Math.round((stats.premium_users + stats.unlimited_users) / stats.total_users * 100)}% of total`
    },
    {
      title: 'Activities (24h)',
      value: formatNumber(systemStats.activities_24h),
      icon: <TrendingUp />,
      color: '#4caf50',
      subtext: `Avg score: ${Math.round(systemStats.avg_score_24h)}%`
    },
    {
      title: 'System Health',
      value: systemStats.errors_24h > 0 ? 'Issues Detected' : 'Healthy',
      icon: <Warning />,
      color: systemStats.errors_24h > 0 ? '#f44336' : '#4caf50',
      subtext: `${systemStats.errors_24h} errors in 24h`
    },
    {
      title: 'Database Size',
      value: formatBytes(systemStats.db_size),
      icon: <Storage />,
      color: '#9c27b0',
      subtext: 'Click to view details'
    }
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
          <Tooltip title="Click for details">
            <Card sx={{ height: '100%', cursor: 'pointer' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      backgroundColor: `${card.color}20`,
                      borderRadius: '50%',
                      p: 1,
                      mr: 1
                    }}
                  >
                    {React.cloneElement(card.icon, { sx: { color: card.color } })}
                  </Box>
                  <Typography variant="h6" component="div">
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" gutterBottom>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.subtext}
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
} 