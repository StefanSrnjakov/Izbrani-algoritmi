import React, { useState } from 'react';
import { Button, Typography, Box, TextField, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Chart from 'chart.js/auto';
import { generateKeys } from '../utils/keyGenerationUtils';
import { startEncryption } from '../utils/encryptionUtils';
import { startDecryption } from '../utils/decryptionUtils';

export const KEY_SIZES = [4, 8, 16, 32, 64, 128, 256, 512, 1024];
export const ITERATIONS = 1;
export const DELAY_MS = 400; // Delay in milliseconds

let performanceChart: Chart | null = null;
let keyGenChart: Chart | null = null;

const PerformanceGraph: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null); // For showing current operation

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // Utility function for delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Generate unique RSA keys (retry on duplicate primes)
  const generateUniqueKeys = (keySize: number) => {
    let keys;
    while (true) {
      try {
        keys = generateKeys(keySize);
        break;
      } catch (error) {
        console.warn(`Duplicate primes encountered for key size ${keySize} bits. Retrying...`);
      }
    }
    return keys;
  };

  // Measure encryption and decryption performance
  const measurePerformance = async (file: File) => {
    if (performanceChart) {
      performanceChart.destroy();
    }
    if (keyGenChart) {
      keyGenChart.destroy();
    }

    const ctxPerformance = document.getElementById('performanceChart') as HTMLCanvasElement;
    const ctxKeyGen = document.getElementById('keyGenChart') as HTMLCanvasElement;

    // Initialize Chart.js line chart for encryption and decryption times
    performanceChart = new Chart(ctxPerformance, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          { label: 'Encryption Time (ms)', data: [], borderColor: 'rgba(75,192,192,1)', fill: false },
          { label: 'Decryption Time (ms)', data: [], borderColor: 'rgba(255,99,132,1)', fill: false },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
        },
        scales: {
          x: { title: { display: true, text: 'Key Size (Bits)' } },
          y: { title: { display: true, text: 'Time (ms)' } },
        },
      },
    });

    // Initialize Chart.js line chart for key generation time
    keyGenChart = new Chart(ctxKeyGen, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          { label: 'Key Generation Time (ms)', data: [], borderColor: 'rgba(54,162,235,1)', fill: false },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
        },
        scales: {
          x: { title: { display: true, text: 'Key Size (Bits)' } },
          y: { title: { display: true, text: 'Time (ms)' } },
        },
      },
    });

    setIsTesting(true);
    setStatusMessage("Starting performance test...");

    for (const keySize of KEY_SIZES) {
      setStatusMessage(`Generating keys with ${keySize}-bit size...`);
      
      // Measure key generation time
      const keyGenStart = performance.now();
      const { pubKey, privKey } = generateUniqueKeys(keySize);
      const keyGenTime = performance.now() - keyGenStart;
      const encryptionTimes: number[] = [];
      const decryptionTimes: number[] = [];

      for (let i = 0; i < ITERATIONS; i++) {
        // Measure encryption time
        setStatusMessage(`Encrypting with ${keySize}-bit key...`);
        const encryptionStart = performance.now();
        await startEncryption(JSON.parse(pubKey), file, () => {});
        encryptionTimes.push(performance.now() - encryptionStart);

        // Measure decryption time
        setStatusMessage(`Decrypting with ${keySize}-bit key...`);
        const decryptionStart = performance.now();
        await startDecryption(file, JSON.parse(privKey), () => {});
        decryptionTimes.push(performance.now() - decryptionStart);

        // Delay to allow chart update
        await delay(DELAY_MS);
      }

      // Calculate averages
      const avgEncryptionTime = encryptionTimes.reduce((a, b) => a + b, 0) / ITERATIONS;
      const avgDecryptionTime = decryptionTimes.reduce((a, b) => a + b, 0) / ITERATIONS;

      // Update performance chart with encryption and decryption times
      if (performanceChart) {
        performanceChart.data.labels?.push(`${keySize} bits`);
        (performanceChart.data.datasets[0].data as number[]).push(avgEncryptionTime);
        (performanceChart.data.datasets[1].data as number[]).push(avgDecryptionTime);
        performanceChart.update();
      }

      // Update key generation chart
      if (keyGenChart) {
        keyGenChart.data.labels?.push(`${keySize} bits`);
        (keyGenChart.data.datasets[0].data as number[]).push(keyGenTime);
        keyGenChart.update();
      }
    }

    setStatusMessage("Performance test completed.");
    setIsTesting(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Performance Graph
      </Typography>
      
      {/* Description */}
      <Typography variant="body1" paragraph>
        These graphs display the average time taken to encrypt, decrypt, and generate keys for a file using RSA keys of varying sizes. 
        Select a file and click "Start Performance Test" to see how times change with different key sizes.
      </Typography>

      {/* File Upload */}
      <TextField
        type="file"
        onChange={handleFileChange}
        variant="outlined"
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: <UploadFileIcon sx={{ mr: 1 }} />,
        }}
      />

      {/* Start Test Button */}
      <Button 
        variant="contained" 
        onClick={() => file && measurePerformance(file)}
        disabled={isTesting || !file}
        startIcon={isTesting ? <CircularProgress size={20} /> : <PlayArrowIcon />}
        sx={{ mt: 2 }}
      >
        {isTesting ? "Testing in Progress..." : "Start Performance Test"}
      </Button>

      {/* Status Message */}
      {statusMessage && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {statusMessage}
        </Typography>
      )}

      {/* Charts */}
      <canvas id="performanceChart" style={{ marginTop: 20 }}></canvas>
      <canvas id="keyGenChart" style={{ marginTop: 40 }}></canvas>
    </Box>
  );
};

export default PerformanceGraph;
