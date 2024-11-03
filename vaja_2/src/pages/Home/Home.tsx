// EncryptionApp.tsx
import React, { useState } from 'react';
import { Button, TextField, Typography, Tabs, Tab, Box, Grid } from '@mui/material';
import { useKeyGenerator } from '../../hooks/useKeyGenerator';
import { useEncryption } from '../../hooks/useEncryption';
import { useDecryption } from '../../hooks/useDecryption';
import { usePerformanceMetrics } from '../../hooks/usePerformanceMetrics';
import Encryption from '../../components/Encryption';
import Decryption from '../../components/Decryption';

const EncryptionApp: React.FC = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hook for key generation
  const { bitLength, setBitLength, keys, generationTime, generateKeys, saveKeysInFile } = useKeyGenerator();
  
  // Hook for encryption
  const { fileToEncrypt, setFileToEncrypt, encryptionTime, encryptFile } = useEncryption();
  
  // Hook for decryption
  const { fileToDecrypt, setFileToDecrypt, decryptionTime, decryptFile } = useDecryption();
  
  // Hook for performance metrics
  const { performanceData, addPerformanceData } = usePerformanceMetrics();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setErrorMessage(null); // Clear error message when switching tabs
  };

  const handleGenerateKeys = async () => {
    try {
      setErrorMessage(null);
      await generateKeys();
      addPerformanceData({ bitLength, generationTime: generationTime || 0, encryptionTime: 0, decryptionTime: 0 });
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
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" align="center" gutterBottom>Encryption & Decryption App</Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Key Generation" />
        <Tab label="Encryption" />
        <Tab label="Decryption" />
        <Tab label="Performance Graph" />
      </Tabs>

      {tabIndex === 0 && (
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
            <Button variant="contained" fullWidth onClick={handleGenerateKeys}>Generate Keys</Button>
            {errorMessage && <Typography color="error" mt={2}>{errorMessage}</Typography>}
            <Typography mt={2}>Public Key: {keys.pubKey}</Typography>
            <Typography>Private Key: {keys.privKey}</Typography>
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
      )}

      {tabIndex === 1 && (
        <Encryption/>
      )}
      {tabIndex === 2 && (
        <Decryption/>
      )}

      {/* Other tabs remain the same */}
    </Box>
  );
};

export default EncryptionApp;
