import React from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { Box } from '@mui/material';
import { Network } from '../types/common';

interface NetworkUIProps {
    network: Network;
}

const NetworkUI: React.FC<NetworkUIProps> = ({ network }) => {
    const graphData = {
        nodes: Object.keys(network['nodeIndexMap']).map((id) => ({
            id,
            name: id, // Label for the node
        })),
        links: network.flattenEdges().map((edge) => ({
            source: edge.from,
            target: edge.to,
            label: `${edge.totalCapacity - edge.remainingCapacity}/${edge.totalCapacity}`, // Label for the edge
        })),
    };


    return (
        <Box sx={{ height: '500px', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box
                sx={{
                    height: '100%',
                    width: '100%',
                    position: 'absolute', // Allow the canvas to scale within this box
                    top: 0,
                    left: 0,
                }}
            >
                <ForceGraph2D
                    graphData={graphData}
                    nodeLabel={(node: any) => `Node ${node.name}`} // Node tooltips
                    linkLabel={(link: any) => `Flow: ${link.label}`} // Edge tooltips
                    width={800} // Explicit canvas width
                    height={500} // Explicit canvas height
                    linkDirectionalArrowLength={6}
                    linkDirectionalArrowRelPos={0.5}
                    linkDirectionalParticles={2}
                    linkDirectionalParticleSpeed={0.02}
                    nodeCanvasObject={(node: any, ctx, globalScale) => {
                        const label = node.name;
                        const fontSize = 18 / globalScale;
                        ctx.font = `${fontSize}px Arial`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = '#ffffff';
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false); // Circular nodes
                        ctx.fillStyle = '#0074D9'; // Blue node color
                        ctx.fill();
                        ctx.lineWidth = 1.5;
                        ctx.strokeStyle = '#003F5C'; // Darker border
                        ctx.stroke();
                        ctx.fillStyle = '#ffffff'; // White text color
                        ctx.fillText(label, node.x, node.y); // Draw node label
                    }}
                    linkCanvasObjectMode={() => 'after'}
                    linkCanvasObject={(link: any, ctx, globalScale) => {
                        const label = link.label;
                        if (!label) return;

                        const fontSize = 18 / globalScale;
                        ctx.font = `${fontSize}px Arial`;
                        ctx.fillStyle = '#2E86C1'; // Edge label color
                        const midX = (link.source.x + link.target.x) / 2;
                        const midY = (link.source.y + link.target.y) / 2;
                        ctx.fillText(label, midX, midY); // Draw edge label
                    }}
                    backgroundColor="#f5f5f5" // Light gray background for better contrast
                />
            </Box>
        </Box>
    );
};

export default NetworkUI;
