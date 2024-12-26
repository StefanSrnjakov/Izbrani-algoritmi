import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MaximumFlowCalculator from '../../components/MaximumFlowCalculator';
import PerformanceMetrics from '../../components/PerformanceMetrics';

const Home: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Network Flow App
      </Typography>
      <Typography variant="body1" paragraph>
        Solve maximum flow problems and visualize network structures.
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="Tabs for application sections">
          <Tab label="Maximum Flow Calculator" />
          <Tab label="Performance Metrics" />

        </Tabs>
      </Box>
      <Box>
        {/* Render the appropriate component based on the active tab */}
        {currentTab === 0 && <MaximumFlowCalculator />}
        {currentTab === 1 && <PerformanceMetrics />}

      </Box>
    </Container>
  );
};

export default Home;
