import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button, Paper, TextField, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Stack } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import './home.css';

const HomePage: React.FC = () => {





  return (
    <Container component="main" maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Network Flow
        </Typography>

        <Stack spacing={3}>
          
        </Stack>
      </Paper>
    </Container>
  );
};

export default HomePage;
