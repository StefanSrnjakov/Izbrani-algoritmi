import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button, Paper, TextField } from '@mui/material';
import './home.css';


const HomePage: React.FC = () => {
  const [bitCount, setBitCount] = useState<number>(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBitCount(Number(event.target.value));
  };

  const handleGenerateClick = () => {
    // This is where you would trigger the prime number generation logic
    console.log(`Generate a prime number with ${bitCount} bits`); // Placeholder for functionality
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Generate Prime Number
        </Typography>
        <TextField
          label="Number of Bits"
          type="number"
          value={bitCount}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 1, max: 32 }} // Limit input to a reasonable range
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateClick}
          fullWidth
        >
          Generate Prime
        </Button>
      </Paper>
    </Container>
  );
};

export default HomePage;