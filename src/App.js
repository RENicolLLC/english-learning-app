/**
 * Main Application Component
 * 
 * This is the root component of the English Learning App.
 * It sets up the main routing and layout structure.
 * 
 * Key Features:
 * - Global error boundary for error handling
 * - Material-UI theme integration
 * - Authentication provider
 * - Responsive layout with navigation
 * - Route configuration for all main pages
 */

import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vocabulary from './pages/Vocabulary';
import Grammar from './pages/Grammar';
import Progress from './pages/Progress';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ScenarioPractice from './pages/ScenarioPractice';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './services/auth/AuthContext';

// Loading component
const LoadingScreen = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress />
  </Box>
);

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <ErrorBoundary>
                  <Navbar />
                </ErrorBoundary>
                <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                  <Routes>
                    <Route path="/" element={
                      <ErrorBoundary>
                        <Home />
                      </ErrorBoundary>
                    } />
                    <Route path="/login" element={
                      <ErrorBoundary>
                        <Login />
                      </ErrorBoundary>
                    } />
                    <Route path="/signup" element={
                      <ErrorBoundary>
                        <Signup />
                      </ErrorBoundary>
                    } />
                    <Route path="/vocabulary" element={
                      <ErrorBoundary>
                        <ProtectedRoute>
                          <Vocabulary />
                        </ProtectedRoute>
                      </ErrorBoundary>
                    } />
                    <Route path="/grammar" element={
                      <ErrorBoundary>
                        <ProtectedRoute>
                          <Grammar />
                        </ProtectedRoute>
                      </ErrorBoundary>
                    } />
                    <Route path="/progress" element={
                      <ErrorBoundary>
                        <ProtectedRoute>
                          <Progress />
                        </ProtectedRoute>
                      </ErrorBoundary>
                    } />
                    <Route path="/scenarios" element={
                      <ErrorBoundary>
                        <ProtectedRoute>
                          <ScenarioPractice />
                        </ProtectedRoute>
                      </ErrorBoundary>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Box>
              </Box>
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App; 