import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';

interface TestPanelProps {
  onClose: () => void;
}

export default function TestPanel({ onClose }: TestPanelProps) {
  const [userId, setUserId] = useState('');
  const [level, setLevel] = useState(1);
  const [subscription, setSubscription] = useState('basic');
  const [showDevTools, setShowDevTools] = useState(false);

  const handleImpersonateUser = async () => {
    try {
      const response = await fetch('/api/admin/bypass-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-bypass': process.env.REACT_APP_ADMIN_BYPASS_KEY || ''
        },
        body: JSON.stringify({ userId, level })
      });
      const data = await response.json();
      localStorage.setItem('userToken', data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Failed to impersonate user:', error);
    }
  };

  const handleResetData = async () => {
    try {
      await fetch('/api/admin/reset-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-bypass': process.env.REACT_APP_ADMIN_BYPASS_KEY || ''
        },
        body: JSON.stringify({ userId })
      });
      alert('Data reset successful');
    } catch (error) {
      console.error('Failed to reset data:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Test Panel</Typography>
        <Button size="small" onClick={onClose}>Close</Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Level</InputLabel>
            <Select
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
            >
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>Level {i + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Subscription</InputLabel>
            <Select
              value={subscription}
              onChange={(e) => setSubscription(e.target.value)}
            >
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="unlimited">Unlimited</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={showDevTools}
                onChange={(e) => setShowDevTools(e.target.checked)}
              />
            }
            label="Show Dev Tools"
          />
        </Grid>

        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleImpersonateUser}
          >
            Impersonate User
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleResetData}
          >
            Reset Data
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
} 