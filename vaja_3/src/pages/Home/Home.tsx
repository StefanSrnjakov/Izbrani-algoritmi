import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SharingSecrets from '../../components/SharingSecrets';
import Reconstruction from '../../components/Reconstruction';
import Analysis from '../../components/Analysis';


const HomePage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Secret Sharing App
      </Typography>
      <Typography variant="body1" paragraph>
        Split files into secure shares, reconstruct them, and analyze performance.
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="Tabs for application sections">
          <Tab label="Sharing Secrets" />
          <Tab label="Reconstruction" />
          <Tab label="Analysis" />
        </Tabs>
      </Box>
      <Box>
        {/* Render the appropriate component based on the active tab */}
        {currentTab === 0 && <SharingSecrets />}
        {currentTab === 1 && <Reconstruction />}
        {currentTab === 2 && <Analysis />}
      </Box>
    </Container>
  );
};

export default HomePage;