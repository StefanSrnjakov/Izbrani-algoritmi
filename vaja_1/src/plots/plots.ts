import Chart from 'chart.js/auto';

let naiveVsMillerRabinChart: Chart | null = null;
let millerRabinVaryingSChart: Chart | null = null;

export const plotNaiveVsMillerRabin = (results: { n: number, naiveTime: number, millerRabinTime: number }[]) => {
    const ctx = document.getElementById('naiveVsMillerRabinChart') as HTMLCanvasElement;

    if (naiveVsMillerRabinChart) {
        naiveVsMillerRabinChart.destroy();
    }

    const labels = results.map(r => r.n);
    const naiveData = results.map(r => r.naiveTime);
    const millerRabinData = results.map(r => r.millerRabinTime);

    naiveVsMillerRabinChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Naive Method', data: naiveData, borderColor: 'red', fill: false },
                { label: 'Miller-Rabin', data: millerRabinData, borderColor: 'blue', fill: false }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Input Size (Bits)' // X-axis label
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Time (ms)' // Y-axis label
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
};

export const plotMillerRabinVaryingS = (results: { s: number, time: number }[]) => {
    const ctx = document.getElementById('millerRabinVaryingSChart') as HTMLCanvasElement;

    // Check if there's already a chart, and destroy it if it exists
    if (millerRabinVaryingSChart) {
        millerRabinVaryingSChart.destroy();
    }

    const labels = results.map(r => r.s);  // Miller-Rabin 's' values
    const times = results.map(r => r.time);  // Time in milliseconds

    millerRabinVaryingSChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { 
                    label: 'Miller-Rabin Time (32-bit)', 
                    data: times, 
                    borderColor: 'green',
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "'s' Parameter in Miller-Rabin"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Time (ms)'
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });
};
