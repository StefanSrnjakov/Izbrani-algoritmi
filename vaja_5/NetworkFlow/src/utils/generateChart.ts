import { Chart } from 'chart.js/auto';

export function generateCharts(resultsByNodes: any[], resultsByEdges: any[]) {
    const nodeChartCanvas = document.getElementById('nodeChart') as HTMLCanvasElement;
    const edgeChartCanvas = document.getElementById('edgeChart') as HTMLCanvasElement;

    new Chart(nodeChartCanvas, {
        type: 'line',
        data: {
            labels: resultsByNodes.map((data) => `Nodes: ${data.nodeCount}`),
            datasets: [
                {
                    label: 'Execution Time (ms)',
                    data: resultsByNodes.map((data) => data.time),
                    borderColor: 'blue',
                    tension: 0.4,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of Nodes',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Execution Time (ms)',
                    },
                    beginAtZero: true,
                },
            },
        },
    });

    new Chart(edgeChartCanvas, {
        type: 'line',
        data: {
            labels: resultsByEdges.map((data) => `Edges: ${data.edgeCount}`),
            datasets: [
                {
                    label: 'Execution Time (ms)',
                    data: resultsByEdges.map((data) => data.time),
                    borderColor: 'red',
                    tension: 0.4,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of Edges',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Execution Time (ms)',
                    },
                    beginAtZero: true,
                },
            },
        },
    });
}
