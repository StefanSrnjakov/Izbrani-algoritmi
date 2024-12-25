// src/App.tsx
import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box } from '@mui/material';
import Home from './pages/Home/Home';

const theme = createTheme({
  palette: {
    mode: 'light',
  }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box
          display="flex"
          flexDirection="column"
          minHeight="calc(100vh - 64px)"
          justifyContent="center"
          paddingY={2}
        >

          <Home />

        </Box>
      </Container>
    </ThemeProvider>
  );
};
export default App;
