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
        const visited = new Set<string>();
        const queue: string[] = [source];
        visited.add(source);

        while (queue.length > 0) {
            const currentNode = queue.shift()!;
            const currentIndex = this.nodeIndexMap[currentNode];

            for (const edge of this.network[currentIndex]) {
                if (!visited.has(edge.to) && edge.remainingCapacity > 0) {
                    parentNodes[edge.to] = currentNode;
                    if (edge.to === sink) return true;
                    visited.add(edge.to);
                    queue.push(edge.to);
                }
            }
        }
        return false;
    }

    edmondsKarp(source: string, sink: string): number {
        const parentNodes: { [key: string]: string } = {};
        let maximumFlow = 0;

        while (this.bfs(source, sink, parentNodes)) {
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
