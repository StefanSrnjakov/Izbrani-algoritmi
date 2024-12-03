import React, { useEffect, useState } from 'react';
import { Typography, Container, Button, CircularProgress, Box } from '@mui/material';
import { ReconstructionAnalysisResponse, reconstructionRobustTest } from '../utils/tests';
import { Chart } from 'chart.js/auto';

const Analysis: React.FC = () => {
    const fileSize = 64;
    const sharesNum = [
        { n: 300, k: 50 },

    ];
    const [loading, setLoading] = useState(false);
    const [bigIntResults, setBigIntResults] = useState<ReconstructionAnalysisResponse>({
        sharesPairs: sharesNum,
        correctPercentage: [],
    });

    const startAnalysis = async () => {
        setLoading(true);
        try {
            const results = await reconstructionRobustTest(sharesNum, fileSize, 30);
            setBigIntResults(results);
        } catch (error) {
            console.error('Error during analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bigIntResults.correctPercentage.length > 0) {
            renderChart();
        }
    }, [bigIntResults]);

    const renderChart = () => {
        const colors = ['blue', 'green', 'orange', 'purple', 'cyan'];

        if (bigIntResults.correctPercentage.length > 0) {
            const bigIntChartCanvas = document.getElementById('bigIntChart') as HTMLCanvasElement;
            if (bigIntChartCanvas) {
                // Create a bar chart for BigInt method analysis
                new Chart(bigIntChartCanvas, {
                    type: 'bar',
                    data: {
                        labels: bigIntResults.sharesPairs.map(
                            ({ n, k }) => `n=${n}, k=${k}`
                        ), // Label each bar with n and k
                        datasets: [
                            {
                                label: 'Correct Percentage (%)',
                                data: bigIntResults.correctPercentage,
                                backgroundColor: colors,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false, // No legend needed for a single dataset
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) =>
                                        `Correct Percentage: ${context.raw}%`,
                                },
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Shares (n, k)',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Correct Percentage (%)',
                                },
                                beginAtZero: true,
                                max: 100,
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
