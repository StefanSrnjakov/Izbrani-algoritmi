import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from '@mui/material';
import { Network } from '../../types/common';

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const network: Network = new Network(6);
    // const graph: Graph = Array.from({ length: 6 }, () => []);
    network.addEdge(0, 1, 16);
    network.addEdge(0, 2, 13);
    network.addEdge(1, 2, 10);
    network.addEdge(1, 3, 12);
    network.addEdge(2, 4, 14);
    network.addEdge(3, 2, 9);
    network.addEdge(3, 5, 20);
    network.addEdge(4, 3, 7);
    network.addEdge(4, 5, 4);
    network.edmondsKarp(0, 5);


    // console.log(network.flattenGraph());


  }, []);






  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }


  };

  const handleSubmit = () => {
    // Placeholder for logic to process the file, source, and sink
    setResult('Result will be displayed here.');
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Maximum Flow Calculator
        </Typography>

        <Stack spacing={3}>
          <Button variant="contained" component="label" color="primary">
            Upload Graph File
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
          {file && <Typography variant="body1">Uploaded File: {file.name}</Typography>}

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Calculate Maximum Flow
          </Button>

          {result && (
            <Paper elevation={1} style={{ padding: '10px' }}>
              <Typography variant="h6">Results:</Typography>
              <Typography variant="body1">{result}</Typography>
            </Paper>
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default Home;
