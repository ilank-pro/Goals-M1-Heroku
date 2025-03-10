import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <AccountTreeIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Organizational Structure App
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
          >
            Org Tree
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 