import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Container,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import StatsCards from './StatsCards';
import UserTable from './UserTable';
import ActivityChart from './ActivityChart';
import ErrorLog from './ErrorLog';
import SystemHealth from './SystemHealth';

interface DashboardData {
  userStats: {
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
  recentActivity: Array<{
    type: string;
    created_at: string;
    user_id: string;
    details: string;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  async function fetchDashboardData() {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'x-admin-bypass': process.env.REACT_APP_ADMIN_BYPASS_KEY || ''
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      const dashboardData = await response.json();
      setData(dashboardData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;

  return (
    <Container maxWidth="xl">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Stats Overview */}
          <Grid item xs={12}>
            <StatsCards stats={data.userStats} systemStats={data.systemStats} />
          </Grid>

          {/* Activity Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: '400px' }}>
              <ActivityChart data={data.recentActivity} />
            </Paper>
          </Grid>

          {/* System Health */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '400px' }}>
              <SystemHealth stats={data.systemStats} />
            </Paper>
          </Grid>

          {/* User Table */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <UserTable />
            </Paper>
          </Grid>

          {/* Error Log */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <ErrorLog />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 