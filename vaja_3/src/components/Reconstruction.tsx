import React, { useState } from 'react';
import { Typography, Container, TextField, Button, Box, FormControlLabel, Checkbox } from '@mui/material';
import { reconstructSecret, reconstructSecretByBytes } from '../utils/reconstruction';

const Reconstruction: React.FC = () => {
  const [k, setK] = useState<number | undefined>();
  const [files, setFiles] = useState<File[]>([]);
  const [outputFileName, setOutputFileName] = useState<string>('reconstructed_secret');
  const [blobOutput, setBlobOutput] = useState<Blob | null>(null);
  const [useBytes, setUseBytes] = useState<boolean>(false); // State for approach selection

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedFiles = [...files];
      updatedFiles[index] = file;
      setFiles(updatedFiles);
    }
  };

  const handleKChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setK(value);
    setFiles(new Array(value).fill(null)); // Initialize empty files array
  };

  const handleSubmit = async () => {
    if (!k) {
      alert('Please enter a threshold value.');
      return;
    }
    if (files.some((file) => !file)) {
      alert('Please upload all share files.');
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
      {k && (
        <Box>
          <Typography variant="body1" gutterBottom>
            Upload {k} share files:
          </Typography>
          {[...Array(k)].map((_, index) => (
            <Box key={index} mb={2}>
              <input
                accept=".json"
                style={{ display: 'none' }}
                id={`file-input-${index}`}
                type="file"
                onChange={(event) => handleFileChange(event, index)}
              />
              <label htmlFor={`file-input-${index}`}>
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                >
                  {files[index] ? `Uploaded: ${files[index].name}` : `Upload Share ${index + 1}`}
                </Button>
              </label>
            </Box>
          ))}
        </Box>
      )}
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
