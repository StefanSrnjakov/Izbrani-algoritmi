// src/components/KeyGenerator.tsx

import React, { useState } from 'react';
import { Button, TextField, Typography, Grid, Box } from '@mui/material';
import { useKeyGenerator } from '../hooks/useKeyGenerator';

const KeyGenerator: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { bitLength, setBitLength, keys, generationTime, generateKeys, saveKeysInFile } = useKeyGenerator();

  const handleGenerateKeys = async () => {
    try {
      setErrorMessage(null);
      await generateKeys();
    } catch (error: any) {
      setErrorMessage(`Key Generation Error: ${error.message}`);
    }
  };

  const handleSaveKeys = () => {
    try {
      saveKeysInFile();
    } catch (error: any) {
      setErrorMessage(`File Save Error: ${error.message}`);
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center" mt={3}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6">Generate Key Pair</Typography>
        <TextField
          fullWidth
          label="Bit Length (3-15)"
          type="number"
          value={bitLength}
          onChange={(e) => setBitLength(parseInt(e.target.value))}
          inputProps={{ min: 3, max: 15 }}
          margin="normal"
        />
        <Button variant="contained" fullWidth onClick={handleGenerateKeys}>
          Generate Keys
        </Button>

        {errorMessage && <Typography color="error" mt={2}>{errorMessage}</Typography>}

        {/* Display generation time if available */}
        {generationTime !== null && (
          <Typography color="textSecondary" mt={2}>
            Key generation took: <strong>{generationTime.toFixed(2)} ms</strong>
          </Typography>
        )}

        {/* Display Public Key in a scrollable box */}
        <Typography mt={2}>Public Key:</Typography>
        <Box
          component="pre"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: 150,   // Limit height to 150px for scroll
            overflowY: 'auto',
            padding: 1,
            borderRadius: 1,
            mt: 1
          }}
        >
          {keys.pubKey}
        </Box>

        {/* Display Private Key in a scrollable box */}
        <Typography mt={2}>Private Key:</Typography>
        <Box
          component="pre"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: 150,   // Limit height to 150px for scroll
            overflowY: 'auto',
            padding: 1,
            borderRadius: 1,
            mt: 1
          }}
        >
          {keys.privKey}
        </Box>

        <Button 
          variant="outlined" 
          fullWidth 
          onClick={handleSaveKeys} 
          disabled={!keys.privKey || !keys.pubKey} 
          sx={{ mt: 2 }}
        >
          Save Keys to File
        </Button>
      </Grid>
    </Grid>
  );
};

export default KeyGenerator;
