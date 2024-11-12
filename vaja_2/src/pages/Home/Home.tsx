// EncryptionApp.tsx
import React, { useState } from 'react';
import {  Typography, Tabs, Tab, Box } from '@mui/material';
import Encryption from '../../components/Encryption';
import Decryption from '../../components/Decryption';
import KeyGenerator from '../../components/KeyGenerator';
import PerformanceGraph from '../../components/PerformanceGraph';

const EncryptionApp: React.FC = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
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
        <KeyGenerator />
      )}

      {tabIndex === 1 && (
        <Encryption />
      )}
      {tabIndex === 2 && (
        <Decryption />
      )}
      {
        tabIndex === 3 && (
          <PerformanceGraph />
        )}
    </Box>
  );
};

export default EncryptionApp;
