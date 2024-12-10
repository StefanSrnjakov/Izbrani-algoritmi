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
    addEdge(u: number, v: number, capacity: number) {
        this.network[u].push({
            from: u,
            to: v,
            capacity,
            reverseIndex: this.network[v].length,
            totalCapacity: capacity,
            isReverseConnection: false
        });
        this.network[v].push({
            from: v,
            to: u,
            capacity: 0,
            reverseIndex: this.network[u].length - 1,
            totalCapacity: capacity,
            isReverseConnection: true
        });
    }
    bfs(s: number, t: number, parent: number[]): boolean {
        const visited = new Array(this.network.length).fill(false);
        const queue: number[] = [s];
        visited[s] = true;

        while (queue.length > 0) {
            const u = queue.shift()!;
            for (const edge of this.network[u]) {
                if (!visited[edge.to] && edge.capacity > 0) {
                    parent[edge.to] = u;
                    if (edge.to === t) return true;
                    visited[edge.to] = true;
                    queue.push(edge.to);
                }
            }
        }
        return false;
    }
    flattenGraph(): Edge[] {
        return this.network.reduce((acc, edges) => [...acc, ...edges], []);
    }
    edmondsKarp(s: number, t: number): void {
        const parent = new Array(this.network.length).fill(-1);
        let maxFlow = 0;

        console.log(parent);
        while (this.bfs(s, t, parent)) {
            let pathFlow = Infinity;
            let v = t;

            while (v !== s) {
                const u = parent[v];
                const edge = this.network[u].find((e) => e.to === v)!;
                pathFlow = Math.min(pathFlow, edge.capacity);
                v = u;
            }

            v = t;
            while (v !== s) {
                const u = parent[v];
                const edge = this.network[u].find((e) => e.to === v)!;
                edge.capacity -= pathFlow;
                this.network[v][edge.reverseIndex].capacity += pathFlow;
                v = u;
            }

            maxFlow += pathFlow;
        }
    }
}