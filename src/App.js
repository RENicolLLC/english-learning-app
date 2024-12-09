import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vocabulary from './pages/Vocabulary';
import Grammar from './pages/Grammar';
import Progress from './pages/Progress';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
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
                <Route path="/vocabulary" element={
                  <ErrorBoundary>
                    <Vocabulary />
                  </ErrorBoundary>
                } />
                <Route path="/grammar" element={
                  <ErrorBoundary>
                    <Grammar />
                  </ErrorBoundary>
                } />
                <Route path="/progress" element={
                  <ErrorBoundary>
                    <Progress />
                  </ErrorBoundary>
                } />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 