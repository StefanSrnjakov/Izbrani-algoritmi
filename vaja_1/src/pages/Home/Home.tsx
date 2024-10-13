import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button, Paper, TextField, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Stack } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { generatePrime, checkPrime } from '../../modules/primeGenerator';
import './home.css';
import { measureMillerRabinWithVaryingS, measureNaiveVsMillerRabin } from '../../tests/test';
import { plotMillerRabinVaryingS, plotNaiveVsMillerRabin } from '../../plots/plots';
import { modularExponentiation } from '../../modules/millerRabin';

const HomePage: React.FC = () => {
  const [bitCount, setBitCount] = useState<number>(1);
  const [method, setMethod] = useState<'naive'|'miller-rabin'>('naive');
  const [millerRabinS, setMillerRabinS] = useState<number>(1);
  const [primeInput, setPrimeInput] = useState<number | null>(null);
  const [output, setOutput] = useState<string>(''); // State to store the output

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBitCount(Number(event.target.value));
  };

  const handleMethodChange = (event: SelectChangeEvent) => {
    setMethod(event.target.value as 'naive' | 'miller-rabin');
  };

  const handleSChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMillerRabinS(Number(event.target.value));
  };

  const handlePrimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrimeInput(Number(event.target.value));
  };

  const handleGenerateClick = () => {
    const prime = generatePrime(bitCount, method, millerRabinS? millerRabinS : 1);
    setOutput(`Generated prime number: (decade) ${prime}, (binary): ${prime.toString(2)}`);
  };
  const handlePrimeCheckClick = () => {
    const isPrime = checkPrime(primeInput!, method, millerRabinS? millerRabinS : 1);
    if ( method === 'miller-rabin'){
      setOutput(isPrime ? `${primeInput} is probably prime. (M-Rabin)` : `${primeInput} is not prime. (M-Rabin)`);
    } else {
      setOutput(isPrime ? `${primeInput} is prime. (Naive)` : `${primeInput} is not prime. (Naive)`);
    }
  };
  const handleNaiveVsMillerRabinClick = () => {
    const results = measureNaiveVsMillerRabin(4, 32, 1);  // Timing data for naive vs Miller-Rabin
    plotNaiveVsMillerRabin(results); // Plot the comparison
  };

  const handleMillerRabinVaryingSClick = () => {
    const results = measureMillerRabinWithVaryingS(32, 1, 20);  // Timing data for varying 's'
    plotMillerRabinVaryingS(results); // Plot for varying 's'
  };


  return (
    <Container component="main" maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Prime Number Generator
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Number of Bits"
            type="number"
            value={bitCount}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth>
            <InputLabel id="method-select-label">Method</InputLabel>
            <Select
              labelId="method-select-label"
              id="method-select"
              value={method}
              onChange={handleMethodChange}
              fullWidth
            >
              <MenuItem value="naive">Naive</MenuItem>
              <MenuItem value="miller-rabin">Miller-Rabin</MenuItem>
            </Select>
          </FormControl>

          {method === 'miller-rabin' && (
            <TextField
              label="Miller-Rabin 's' Parameter"
              type="number"
              value={millerRabinS}
              onChange={handleSChange}
              fullWidth
              margin="normal"
            />
          )}

          <Button variant="contained" color="primary" onClick={handleGenerateClick} fullWidth>
            Generate Prime
          </Button>

          <>
            <TextField
              label="Number to Check"
              type="number"
              value={primeInput || ''}
              onChange={handlePrimeInputChange}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="secondary" onClick={handlePrimeCheckClick} fullWidth>
              Check Prime
            </Button>
          </>

          <Typography variant="h6" color="textSecondary">
            {output}
          </Typography>

          {/* New Buttons to Trigger Plots */}
          <Button variant="contained" color="primary" onClick={handleNaiveVsMillerRabinClick} fullWidth>
            Plot Naive vs Miller-Rabin Timing
          </Button>

          <Button variant="contained" color="secondary" onClick={handleMillerRabinVaryingSClick} fullWidth>
            Plot Miller-Rabin with Varying S
          </Button>

          {/* New Canvas Elements for Plots */}
          <Typography variant="h6" align="center">Timing Results</Typography>
          <canvas id="naiveVsMillerRabinChart" width="400" height="200"></canvas>
          <canvas id="millerRabinVaryingSChart" width="400" height="200"></canvas>
        </Stack>
      </Paper>
    </Container>
  );
};

export default HomePage;
