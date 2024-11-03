// Encryption.tsx
import React, { useState } from 'react';
import { Button, TextField, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { useEncryption } from '../hooks/useEncryption';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const Encryption: React.FC = () => {
  const { 
    fileToEncrypt, 
    setFileToEncrypt, 
    publicKeyFile, 
    setPublicKeyFile, 
    encryptFile, 
    encryptionTime, 
    encryptedContent 
  } = useEncryption();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEncryptFile = async () => {
    if (!fileToEncrypt || !publicKeyFile) {
      setErrorMessage("Please select a file to encrypt and a public key.");
      return;
    }
    try {
      setErrorMessage(null);
      await encryptFile();
    } catch (error: any) {
      setErrorMessage(`Encryption Error: ${error.message}`);
    }
  };

  const handleDownloadEncryptedFile = () => {
    if (encryptedContent) {
      const blob = new Blob([encryptedContent], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileToEncrypt?.name || 'encrypted'}.enc`; // Save with .enc extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Free memory
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 5 }}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
              <LockIcon color="primary" fontSize="large" />
              <Typography variant="h5" fontWeight="bold" ml={1}>Encrypt Your File</Typography>
            </Box>

            <Typography variant="body1" color="textSecondary" mb={2} textAlign="center">
              Select the file you wish to encrypt and the public key.
            </Typography>

            {/* File input for the file to be encrypted */}
            <TextField
              fullWidth
              variant="outlined"
              type="file"
              label="File to Encrypt"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setFileToEncrypt(target.files ? target.files[0] : null);
              }}
              margin="normal"
              InputProps={{
                startAdornment: <FileUploadIcon color="action" sx={{ mr: 1 }} />
              }}
            />

            {/* File input for the public key */}
            <TextField
              fullWidth
              variant="outlined"
              type="file"
              label="Public Key File"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setPublicKeyFile(target.files ? target.files[0] : null);
              }}
              margin="normal"
              InputProps={{
                startAdornment: <VpnKeyIcon color="action" sx={{ mr: 1 }} />
              }}
            />

            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={handleEncryptFile} 
              sx={{ mt: 3, py: 1.5 }}
              startIcon={<LockIcon />}
            >
              Encrypt File
            </Button>

            {encryptedContent && (
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleDownloadEncryptedFile}
                sx={{ mt: 2, py: 1.5 }}
              >
                Download Encrypted File
              </Button>
            )}

            {errorMessage && <Typography color="error" mt={2} textAlign="center">{errorMessage}</Typography>}
            {encryptionTime !== null && (
              <Typography mt={2} color="textSecondary" textAlign="center">
                Encryption completed in <strong>{encryptionTime} ms</strong>
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Encryption;
