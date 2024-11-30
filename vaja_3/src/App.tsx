// src/App.tsx
import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import About from './pages/About';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Container>
          <Box
            display="flex"
            flexDirection="column"
            minHeight="calc(100vh - 64px)" // Adjust this value based on your Header and Footer heights
            justifyContent="center"
            paddingY={2} // Vertical padding
          >
            <Routes>

              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />

            </Routes>
          </Box>
        </Container>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};
export default App;
