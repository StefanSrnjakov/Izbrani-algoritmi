import { Network } from "../types/common";

export function generateRandomGraph(nodeCount: number, edgeCount: number): Network {
    const nodes = Array.from({ length: nodeCount }, (_, i) => i.toString());
    const network = new Network(nodes);

    while (edgeCount > 0) {
        const fromNode = nodes[Math.floor(Math.random() * nodes.length)];
        const toNode = nodes[Math.floor(Math.random() * nodes.length)];

        if (fromNode !== toNode) {
            const capacity = Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 1 : 0;
            network.addEdge(fromNode, toNode, capacity);
            edgeCount--;
        }
    }

    return network;
}

export function measureExecutionTime(network: Network, source: string, sink: string): number {
    const start = performance.now();
    network.edmondsKarp(source, sink);
    const end = performance.now();
    return end - start; // Time in milliseconds
}

export function generateDataForCharts() {
    const resultsByNodes = [];
    const resultsByEdges = [];

    // Varying number of nodes
    for (let nodeCount = 10; nodeCount <= 100; nodeCount += 10) {
        const network = generateRandomGraph(nodeCount, nodeCount * 2);
        const time = measureExecutionTime(network, "0", (nodeCount - 1).toString());
        resultsByNodes.push({ nodeCount, time });

    }

    // Fixed nodes, varying edges
    const fixedNodeCount = 30;
    for (let edgeCount = 10; edgeCount <= 1000; edgeCount += 100) {
        const network = generateRandomGraph(fixedNodeCount, edgeCount);
        const time = measureExecutionTime(network, "0", (fixedNodeCount - 1).toString());
        resultsByEdges.push({ edgeCount, time });
    }

    return { resultsByNodes, resultsByEdges };
}

