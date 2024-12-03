import React, { useState } from 'react';
import { Typography, Container, TextField, Button, Box, FormControlLabel, Checkbox } from '@mui/material';
import { reconstructSecret, reconstructSecretByBytes } from '../utils/reconstruction';

const Reconstruction: React.FC = () => {
  const [k, setK] = useState<number | undefined>();
  const [files, setFiles] = useState<File[]>([]);
  const [outputFileName, setOutputFileName] = useState<string>('reconstructed_secret');
  const [blobOutput, setBlobOutput] = useState<Blob | null>(null);
  const [useBytes, setUseBytes] = useState<boolean>(false); // State for approach selection

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles)); // Store selected files as an array
    }
  };

  const handleKChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setK(value);
  };

  const handleSubmit = async () => {
    if (!k) {
      alert('Please enter a threshold value.');
      return;
    }
    if (files.length < k) {
      alert(`Please upload at least ${k} share files.`);
      return;
    }

    try {
      if (useBytes) {
        const blob = await reconstructSecretByBytes(files, k);
        setBlobOutput(blob);
        alert('Byte-based reconstruction successful! You can now download the result.');
      } else {
        const reconstructedValue = await reconstructSecret(files, k);

        const blob = new Blob([reconstructedValue]);
        setBlobOutput(blob); // Save Blob in state
        alert('Reconstruction successful! You can now download the result.');
      }
    } catch (error: any) {
      console.log(error);
      alert(`Error during reconstruction: ${error.message}`);
    }
  };

  const handleDownload = () => {
    if (!blobOutput) return;

    const url = URL.createObjectURL(blobOutput);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${outputFileName.trim() || 'reconstructed_secret'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Reconstruct Secrets
      </Typography>
      <Box mb={2}>
        <TextField
          label="k (threshold)"
          type="number"
          value={k || ''}
          onChange={handleKChange}
          fullWidth
          margin="normal"
        />
      </Box>
      <Box mb={2}>
        <Typography variant="body1" gutterBottom>
          Upload share files:
        </Typography>
        <input
          accept=".json"
          style={{ display: 'none' }}
          id="file-input"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="file-input">
          <Button variant="outlined" component="span" fullWidth>
            {files.length > 0
              ? `Uploaded ${files.length} file(s)`
              : 'Upload Share Files'}
          </Button>
        </label>
      </Box>
      <Box mb={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={useBytes}
              onChange={(e) => setUseBytes(e.target.checked)}
              color="primary"
            />
          }
          label="Reconstruct By Bytes"
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Output File Name"
          value={outputFileName}
          onChange={(e) => setOutputFileName(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="reconstructed_secret"
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '16px' }}>
        Submit
      </Button>
      {blobOutput && (
        <Box mt={4}>
          <Typography variant="body1">The reconstructed secret is ready to download:</Typography>
          <Button variant="contained" color="secondary" onClick={handleDownload}>
            Download Secret
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Reconstruction;
