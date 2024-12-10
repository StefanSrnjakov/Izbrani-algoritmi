export type Edge = {
    from: number,
    to: number;
    capacity: number;
    reverseIndex: number,
    totalCapacity: number,
    isReverseConnection: boolean
};

export class Network {
    private readonly network: Edge[][] = [];

    constructor(nodes: number) {
        this.network = Array.from({ length: nodes }, () => []);
    }
    addEdge(fromNode: number, toNode: number, capacity: number) {
        this.network[fromNode].push({
            from: fromNode,
            to: toNode,
            capacity,
            reverseIndex: this.network[toNode].length,
            totalCapacity: capacity,
            isReverseConnection: false
        });
        this.network[toNode].push({
            from: toNode,
            to: fromNode,
            capacity: 0,
            reverseIndex: this.network[fromNode].length - 1,
            totalCapacity: capacity,
            isReverseConnection: true
        });
    }
    bfs(source: number, sink: number, parentNodes: number[]): boolean {
        const visited = new Array(this.network.length).fill(false);
        const queue: number[] = [source];
        visited[source] = true;

        while (queue.length > 0) {
            const currentNode = queue.shift()!;
            for (const edge of this.network[currentNode]) {
                if (!visited[edge.to] && edge.capacity > 0) {
                    parentNodes[edge.to] = currentNode;
                    if (edge.to === sink) return true;
                    visited[edge.to] = true;
                    queue.push(edge.to);
                }
            }
        }
        return false;
    }
    flattenGraph(): Edge[] {
        return this.network.reduce((accumulatedEdges, edges) => [...accumulatedEdges, ...edges], []);
    }
    edmondsKarp(source: number, sink: number): void {
        const parentNodes = new Array(this.network.length).fill(-1);
        let maximumFlow = 0;

        console.log(parentNodes);
        while (this.bfs(source, sink, parentNodes)) {
            let pathFlow = Infinity;
            let currentNode = sink;

            while (currentNode !== source) {
                const previousNode = parentNodes[currentNode];
                const edge = this.network[previousNode].find((e) => e.to === currentNode)!;
                pathFlow = Math.min(pathFlow, edge.capacity);
                currentNode = previousNode;
            }

            currentNode = sink;
            while (currentNode !== source) {
                const previousNode = parentNodes[currentNode];
                const edge = this.network[previousNode].find((e) => e.to === currentNode)!;
                edge.capacity -= pathFlow;
                this.network[currentNode][edge.reverseIndex].capacity += pathFlow;
                currentNode = previousNode;
            }

            maximumFlow += pathFlow;
        }
    }
}
