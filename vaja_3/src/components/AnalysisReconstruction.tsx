import React, { useEffect, useState } from 'react';
import { Typography, Container, Button, CircularProgress, Box } from '@mui/material';
import { ReconstructionAnalysisResponse, reconstructionRobustTest } from '../utils/tests';
import { Chart } from 'chart.js/auto';

const Analysis: React.FC = () => {
    const fileSize = 1000;
    const sharesNum = [
        { n: 30, k: 5 },
        { n: 50, k: 10 },
        { n: 70, k: 15 },
        { n: 100, k: 20 },
        { n: 150, k: 30 },
        { n: 200, k: 40 },
        { n: 250, k: 50 },
        { n: 250, k: 52 },
        { n: 250, k: 53 },
        { n: 250, k: 54 },
        { n: 300, k: 60 },
        { n: 350, k: 70 },
        { n: 400, k: 80 },
        { n: 450, k: 90 },
        { n: 500, k: 100 },

    ];
    const [loading, setLoading] = useState(false);
    const [bigIntResults, setBigIntResults] = useState<ReconstructionAnalysisResponse>({
        sharesPairs: sharesNum,
        correctPercentage: [],
        correctBytesPercentage: [],
    });

    const startAnalysis = async () => {
        setLoading(true);
        try {
            const results = await reconstructionRobustTest(sharesNum, fileSize, 100);
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
                Analyze Precision of not precise reconstruction
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
                        Analysis of reconstruction of 1kb file, for each pair of shares (n, k). repeated 100 times.
                    </Typography>
                    <canvas id="bigIntChart"></canvas>
                </>
            )}
        </Container>
    );
};

export default Analysis;
