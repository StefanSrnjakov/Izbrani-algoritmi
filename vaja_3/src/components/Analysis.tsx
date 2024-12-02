import React, { useEffect, useState } from 'react';
import { Typography, Container, Button, CircularProgress, Box } from '@mui/material';
import { secretSharingAnalysisBigInt, secretSharingAnalysisBytes } from '../utils/tests';
import { Chart } from 'chart.js/auto';

interface AnalysisResponse {
  fileLength: number[];
  secretSharingTimes: number[];
  reconstructionTimes: number[];
  dataMatchAfterReconstruction: boolean[];
}

const Analysis: React.FC = () => {
  const fileSizes = [64, 4096, 32768, 65536, 131072];
  const [loading, setLoading] = useState(false);
  const [bigIntResults, setBigIntResults] = useState<AnalysisResponse[]>([]);
  const [byteResults, setByteResults] = useState<AnalysisResponse[]>([]);

  const configs = [
    { n: 10, k: 5 },
    { n: 20, k: 10 },
    { n: 40, k: 20 },
  ];
  const startAnalysis = async () => {
    setLoading(true);
    try {


      const bigIntPromises = configs.map(({ n, k }) => (secretSharingAnalysisBigInt(fileSizes, n, k)));
      const bytePromises = configs.map(({ n, k }) => secretSharingAnalysisBytes(fileSizes, n, k));

      const bigIntResults = await Promise.all(bigIntPromises);
      const byteResults = await Promise.all(bytePromises);

      setBigIntResults(bigIntResults);
      setByteResults(byteResults);
    } catch (error) {
      console.error('Error during analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bigIntResults.length > 0 && byteResults.length > 0) {
      renderCharts();
    }
  }, [bigIntResults, byteResults]);

  const renderCharts = () => {
    const colors = ['blue', 'green', 'orange', 'purple', 'cyan', 'magenta'];

    if (bigIntResults.length) {
      const bigIntChartCanvas = document.getElementById('bigIntChart') as HTMLCanvasElement;
      if (bigIntChartCanvas) {
        new Chart(bigIntChartCanvas, {
          type: 'line',
          data: {
            labels: fileSizes,
            datasets: bigIntResults.flatMap((result, index) => [
              {
                label: `BigInt Secret Sharing n=${configs[index].n}, k=${configs[index].k}`,
                data: result.secretSharingTimes,
                borderColor: colors[index],
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: `BigInt Reconstruction n=${configs[index].n}, k=${configs[index].k}`,
                data: result.reconstructionTimes,
                borderColor: colors[index],
                borderDash: [5, 5],
                borderWidth: 2,
                tension: 0.1,
              },
            ]),
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'File Length (Bytes)',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Time (ms)',
                },
              },
            },
          },
        });
      }
    }

    if (byteResults.length) {
      const byteChartCanvas = document.getElementById('byteChart') as HTMLCanvasElement;
      if (byteChartCanvas) {
        new Chart(byteChartCanvas, {
          type: 'line',
          data: {
            labels: fileSizes,
            datasets: byteResults.flatMap((result, index) => [
              {
                label: `Bytes Secret Sharing n=${configs[index].n}, k=${configs[index].k}`,
                data: result.secretSharingTimes,
                borderColor: colors[index],
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: `Bytes Reconstruction n=${configs[index].n}, k=${configs[index].k}`,
                data: result.reconstructionTimes,
                borderColor: colors[index],
                borderDash: [5, 5],
                borderWidth: 2,
                tension: 0.1,
              },
            ]),
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'File Length (Bytes)',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Time (ms)',
                },
              },
            },
          },
        });
      }
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Analyze Performance
      </Typography>
      {!loading && (
        <Button variant="contained" color="primary" onClick={startAnalysis}>
          Start Analysis
        </Button>
      )}
      {loading && (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      )}
      {!loading && (
        <>
          <Typography variant="h6" gutterBottom>
            BigInt Method Analysis
          </Typography>
          <canvas id="bigIntChart"></canvas>

          <Typography variant="h6" gutterBottom>
            Byte Method Analysis
          </Typography>
          <canvas id="byteChart"></canvas>
        </>
      )}
    </Container>
  );
};

export default Analysis;
