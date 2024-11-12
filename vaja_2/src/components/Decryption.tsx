import React, { useState } from 'react';
import { Button, TextField, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { useDecryption } from '../hooks/useDecryption';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const Decryption: React.FC = () => {
  const { 
    fileToDecrypt, 
    setFileToDecrypt, 
    privateKeyFile, 
    setPrivateKeyFile, 
    decryptFile, 
    decryptionTime, 
    decryptedContent 
  } = useDecryption();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDecryptFile = async () => {
    if (!fileToDecrypt || !privateKeyFile) {
      setErrorMessage("Please select a file to decrypt and a private key.");
      return;
    }
    try {
      setErrorMessage(null);
      await decryptFile();
    } catch (error: any) {
      setErrorMessage(`Decryption Error: ${error.message}`);
    }
  };

  const handleDownloadDecryptedFile = () => {
    if (decryptedContent) {
      const blob = new Blob([decryptedContent], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileToDecrypt?.name.replace(/\.enc$/, '') || 'decrypted'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 5 }}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
              <LockOpenIcon color="primary" fontSize="large" />
              <Typography variant="h5" fontWeight="bold" ml={1}>Decrypt Your File</Typography>
            </Box>

            <Typography variant="body1" color="textSecondary" mb={2} textAlign="center">
              Select the encrypted file and your private key to decrypt.
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              type="file"
              label="File to Decrypt"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setFileToDecrypt(target.files ? target.files[0] : null);
              }}
              margin="normal"
              InputProps={{
                startAdornment: <FileUploadIcon color="action" sx={{ mr: 1 }} />
              }}
            />

            <TextField
              fullWidth
              variant="outlined"
              type="file"
              label="Private Key File"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setPrivateKeyFile(target.files ? target.files[0] : null);
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
              onClick={handleDecryptFile} 
              sx={{ mt: 3, py: 1.5 }}
              startIcon={<LockOpenIcon />}
            >
              Decrypt File
            </Button>

            {decryptedContent && (
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleDownloadDecryptedFile}
                sx={{ mt: 2, py: 1.5 }}
              >
                Download Decrypted File
              </Button>
            )}

            {errorMessage && <Typography color="error" mt={2} textAlign="center">{errorMessage}</Typography>}
            {decryptionTime !== null && (
              <Typography mt={2} color="textSecondary" textAlign="center">
                Decryption completed in <strong>{decryptionTime} ms</strong>
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Decryption;
