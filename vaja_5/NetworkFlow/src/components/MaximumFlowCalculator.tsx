import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    TextField,
    Stack,
} from '@mui/material';
import { Network } from '../types/common';
import NetworkUI from './NetworkUI';

const MaximumFlowCalculator: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [source, setSource] = useState<string>('');
    const [sink, setSink] = useState<string>('');
    const [network, setNetwork] = useState<Network | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const parseFile = async (): Promise<{ nodes: string[]; edges: [string, string, number][] }> => {
        if (!file) throw new Error('No file uploaded');

        const text = await file.text();
        const lines = text.trim().split('\n');
        const edges: [string, string, number][] = lines.slice(1).map((line) => {
            const [from, to, capacity] = line.split(' ');
            return [from, to, parseInt(capacity, 10)];
        });

        const nodes = Array.from(new Set(edges.flatMap(([from, to]) => [from, to])));
        return { nodes, edges };
    };

    const handleSubmit = async () => {
        try {
            const { nodes, edges } = await parseFile();
            const network = new Network(nodes);

            edges.forEach(([from, to, capacity]) => {
                network.addEdge(from, to, capacity);
            });

            const maxFlow = network.edmondsKarp(source, sink);
            const flattenEdges = network.flattenEdges();
            const result = flattenEdges
                .map((edge) => `(${edge.from}, ${edge.to}) [${edge.totalCapacity - edge.remainingCapacity}/${edge.totalCapacity}]`)
                .join('<br>');

            setNetwork(network);
            setResult(`${result}<br><br>Max Flow: ${maxFlow}`);
        } catch (error: any) {
            setResult(`Error: ${error.message}`);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Maximum Flow Calculator
                </Typography>

                <Stack spacing={3}>
                    <Button variant="contained" component="label" color="primary">
                        Upload Graph File
                        <input type="file" hidden onChange={handleFileUpload} />
                    </Button>
                    {file && <Typography variant="body1">Uploaded File: {file.name}</Typography>}

                    <TextField
                        label="Source Node"
                        variant="outlined"
                        fullWidth
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                    />
                    <TextField
                        label="Sink Node"
                        variant="outlined"
                        fullWidth
                        value={sink}
                        onChange={(e) => setSink(e.target.value)}
                    />

                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Calculate Maximum Flow
                    </Button>

                    {result && (
                        <Paper elevation={1} style={{ padding: '10px' }}>
                            <Typography
                                variant="body1"
                                dangerouslySetInnerHTML={{ __html: result }}
                            />
                        </Paper>
                    )}
                    {network && (
                        <Paper elevation={1} style={{ padding: '10px' }}>
                            <NetworkUI network={network} />
                        </Paper>
                    )}
                </Stack>
            </Paper>
        </Container>
    );
};

export default MaximumFlowCalculator;
