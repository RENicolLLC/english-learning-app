/**
 * Navigation Bar Component
 * 
 * Provides the main navigation for the application with responsive design.
 * Adapts between desktop and mobile views automatically.
 * 
 * Features:
 * - Responsive design (hamburger menu on mobile)
 * - Material-UI integration
 * - Dynamic navigation links
 * - Consistent styling
 */

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../services/auth/AuthContext';

// Navigation items configuration
const navItems = [
  { text: 'Home', path: '/' },
  { text: 'Scenarios', path: '/scenarios' },
  { text: 'Vocabulary', path: '/vocabulary' },
  { text: 'Grammar', path: '/grammar' },
  { text: 'Progress', path: '/progress' }
];

function Navbar() {
  // State for mobile menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  // Theme and responsive design hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Mobile menu handlers
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    handleUserMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* App logo */}
        <SchoolIcon sx={{ mr: 2 }} />
        
        {/* App title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          English Learning App
        </Typography>
        
        {/* Responsive navigation menu */}
        {isMobile ? (
          // Mobile view - Hamburger menu
          <>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {/* Mobile menu items */}
              {navItems.map((item) => (
                <MenuItem
                  key={item.text}
                  onClick={handleClose}
                  component={RouterLink}
                  to={item.path}
                >
                  {item.text}
                </MenuItem>
              ))}
              {user && <Divider />}
              {user && (
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          // Desktop view - Horizontal buttons
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={RouterLink}
                to={item.path}
              >
                {item.text}
              </Button>
            ))}
            {user ? (
              <>
                <IconButton
                  onClick={handleUserMenu}
                  sx={{ ml: 2 }}
                >
                  <Avatar
                    alt={user.display_name || 'User'}
                    src={user.avatar_url}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem onClick={() => {
                    handleUserMenuClose();
                    navigate('/profile');
                  }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
              >
                Login
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 