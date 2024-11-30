import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const HomePage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to the Lost and Found App
      </Typography>
      <Typography variant="body1" paragraph>
        Here, you can report lost items or find items that have been reported as found.
      </Typography>
      <Typography variant="body1">
        Please navigate through the site to use its features!
      </Typography>
    </Container>
  );
};

export default HomePage;