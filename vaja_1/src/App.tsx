// src/App.tsx
import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import { random } from './utils/utils';

const theme = createTheme({
  palette: {
    mode: 'dark',
  }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container>
          <Box
            display="flex"
            flexDirection="column"
            minHeight="calc(100vh - 64px)"
            justifyContent="center"
            paddingY={2}
          >
            <Routes>

              <Route path="/" element={<Home />} />

            </Routes>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
};
export default App;
