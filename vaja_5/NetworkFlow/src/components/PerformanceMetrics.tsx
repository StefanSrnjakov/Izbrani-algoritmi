import React, { useEffect } from 'react';
import { generateDataForCharts } from '../utils/common';
import { generateCharts } from '../utils/generateChart';

const PerformanceMetrics: React.FC = () => {
    useEffect(() => {
        const { resultsByNodes, resultsByEdges } = generateDataForCharts();
        generateCharts(resultsByNodes, resultsByEdges);
    }, []);

    return (
        <div>
            <h2>Performance Metrics</h2>
            <canvas id="nodeChart"></canvas>
            <canvas id="edgeChart"></canvas>
        </div>
    );
};

export default PerformanceMetrics;
