import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { secretSharing, secretSharingByBytes } from '../utils/secretSharing';

const SharingSecrets: React.FC = () => {
  const [n, setN] = useState<number>(0);
  const [k, setK] = useState<number>(0);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [prefix, setPrefix] = useState<string>("");
  const [method, setMethod] = useState<string>("secretSharing"); // Default method
  const [downloadLinks, setDownloadLinks] = useState<Array<{ fileName: string; fileContent: string; url: string }>>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setInputFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!n || !k || !inputFile || !prefix) {
      alert("Please fill all the fields.");
      return;
    }
    if (k > n || k < 1 || n < 1) {
      alert("Invalid values for n and k.");
      return;
    }

    try {
      let shares: any[] = [];

      // Choose the method based on user selection
      if (method === "secretSharing") {
        shares = await secretSharing(n, k, inputFile);
      } else if (method === "secretSharingByBytes") {
        shares = await secretSharingByBytes(n, k, inputFile);
      }

      // Generate download links for each share
      const links = shares.map(({ x, f }, i) => {
        const fileName = `${prefix}${i + 1}.json`; // File name format

        // Handle f if it's BigInt or an array of BigInt
        const processedF = Array.isArray(f)
          ? f.map((value) => value.toString()) // Convert each BigInt to string
          : f.toString(); // Convert single BigInt to string

        const fileContent = JSON.stringify({ x: x.toString(), f: processedF }); // Convert x to string
        const blob = new Blob([fileContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        return { fileName, fileContent, url };
      });

      setDownloadLinks(links); // Store download links in state
    } catch (error) {
      console.error("Error generating secret shares:", error);
      alert("An error occurred while generating the shares. Please try again.");
    }
  };

  const handleDownloadAll = () => {
    downloadLinks.forEach(({ fileName, url }) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();

      // Clean up the object URL after download
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Share Secrets
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Total Shares (n)"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              InputProps={{
                inputProps: { min: 1 },
                endAdornment: <InputAdornment position="end">shares</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Minimum Shares (k)"
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              InputProps={{
                inputProps: { min: 1 },
                endAdornment: <InputAdornment position="end">shares</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" component="label" fullWidth>
              Upload File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {inputFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected File: {inputFile.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Prefix for Share Files"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g., share_"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel>Secret Sharing Method</FormLabel>
              <RadioGroup
                row
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <FormControlLabel
                  value="secretSharing"
                  control={<Radio />}
                  label="Secret Sharing with BigIntegers"
                />
                <FormControlLabel
                  value="secretSharingByBytes"
                  control={<Radio />}
                  label="Secret Sharing By Bytes"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
              Generate Shares
            </Button>
          </Grid>
          {downloadLinks.length > 0 && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Download Shares
                </Typography>
                <Box
                  sx={{
                    maxHeight: 300,
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    padding: 2,
                    borderRadius: 2,
                  }}
                >
                  {downloadLinks.map(({ fileName, url }, index) => (
                    <Button
                      key={index}
                      href={url}
                      download={fileName}
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Download {fileName}
                    </Button>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleDownloadAll}
                >
                  Download All Shares
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default SharingSecrets;
