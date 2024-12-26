export type Edge = {
    from: string;
    to: string;
    remainingCapacity: number;
    reverseIndex: number;
    totalCapacity: number;
    isReverseConnection: boolean;
};

export class Network {
    private readonly network: Edge[][] = [];
    private readonly nodeIndexMap: { [key: string]: number } = {};
    private readonly indexNodeMap: { [key: number]: string } = {};
    private nextNodeIndex = 0;

    constructor(nodes: string[]) {
        nodes.forEach((node) => this.addNode(node));
    }

    private addNode(nodeName: string): void {
        if (!(nodeName in this.nodeIndexMap)) {
            this.nodeIndexMap[nodeName] = this.nextNodeIndex;
            this.indexNodeMap[this.nextNodeIndex] = nodeName;
            this.network.push([]);
            this.nextNodeIndex++;
        }
    }

    addEdge(fromNode: string, toNode: string, capacity: number) {
        this.addNode(fromNode);
        this.addNode(toNode);

        const fromIndex = this.nodeIndexMap[fromNode];
        const toIndex = this.nodeIndexMap[toNode];

        this.network[fromIndex].push({
            from: fromNode,
            to: toNode,
            remainingCapacity: capacity,
            reverseIndex: this.network[toIndex].length,
            totalCapacity: capacity,
            isReverseConnection: false
        });
        this.network[toIndex].push({
            from: toNode,
            to: fromNode,
            remainingCapacity: 0,
            reverseIndex: this.network[fromIndex].length - 1,
            totalCapacity: capacity,
            isReverseConnection: true
        });
    }

    bfs(source: string, sink: string, parentNodes: { [key: string]: string }): boolean {
        if (!(source in this.nodeIndexMap) || !(sink in this.nodeIndexMap)) {
            throw new Error(`Source (${source}) or Sink (${sink}) not found in the graph.`);
        }

        const visited = new Set<string>();
        const queue: string[] = [source];
        visited.add(source);

        while (queue.length > 0) {
            const currentNode = queue.shift()!;
            const currentIndex = this.nodeIndexMap[currentNode];

            for (const edge of this.network[currentIndex]) {
                // Debugging: Log edge information

                if (!visited.has(edge.to) && edge.remainingCapacity > 0) {
                    parentNodes[edge.to] = currentNode; // Track the parent of the current node

                    // Debugging: Log path discovery

                    if (edge.to === sink) {
                        // Debugging: Log successful path discovery
                        return true;
                    }

                    visited.add(edge.to); // Mark the node as visited
                    queue.push(edge.to);  // Add the node to the queue
                }
            }
        }

        // Debugging: Log when no path is found
        return false;
    }

    edmondsKarp(source: string, sink: string): number {
        const parentNodes: { [key: string]: string } = {};
        let maximumFlow = 0;

        let i = 0;
        while (this.bfs(source, sink, parentNodes)) {
            i++;
            if (i > 10000) {
                console.log(this);
                return 0;
            }
            let pathFlow = Infinity;
            let currentNode = sink;

            while (currentNode !== source) {
                const previousNode = parentNodes[currentNode];
                const previousIndex = this.nodeIndexMap[previousNode];
                const edge = this.network[previousIndex].find((e) => e.to === currentNode)!;
                pathFlow = Math.min(pathFlow, edge.remainingCapacity);
                currentNode = previousNode;
            }

            currentNode = sink;
            while (currentNode !== source) {
                const previousNode = parentNodes[currentNode];
                const previousIndex = this.nodeIndexMap[previousNode];
                const edge = this.network[previousIndex].find((e) => e.to === currentNode)!;
                edge.remainingCapacity -= pathFlow;
                const reverseEdge = this.network[this.nodeIndexMap[currentNode]][edge.reverseIndex];
                reverseEdge.remainingCapacity += pathFlow;
                currentNode = previousNode;
            }

            maximumFlow += pathFlow;
        }

        return maximumFlow;
    }

    flattenEdges(): Edge[] {
        return this.network.reduce((accumulatedEdges, edges) => [...accumulatedEdges, ...edges], []).filter((edge) => !edge.isReverseConnection);
    }
}


