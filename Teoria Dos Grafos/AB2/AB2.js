const { readFileSync } = require("fs");
const __mapInput = readFileSync("./map.txt").toString("utf-8");

class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @param {Vec2} O 
     * @returns {number}
     */
    distance(O) {
        return Math.sqrt(Math.pow(this.x - O.x, 2) + Math.pow(this.y - O.y, 2));
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

function readFile(file) {
    file = file.split(/\n/g);

    const readLine = str => str.split(/\s*,\s*/g).map(Number);

    const [ q_start_x, q_start_y ] = readLine(file.shift());
    const [ q_goal_x, q_goal_y ] = readLine(file.shift());
    let [ numObstacles ] = readLine(file.shift());
    const obstacles = [];
    
    while (numObstacles--) {
        let [ numQuinas ] = readLine(file.shift());
        const quinas = [];

        while (numQuinas--) {
            const [x, y] = readLine(file.shift());
            quinas.push(new Vec2(x, y));
        }

        obstacles.push(quinas);
    }

    return {
        start: new Vec2(q_start_x, q_start_y),
        end: new Vec2(q_goal_x, q_goal_y),
        obstacles: obstacles
    };
}

class VisibilityGraph {
    /**
     * @constructor
     * @param {Vec2[]} obstacles 
     */
    constructor(obstacles) {
        this.obstacles = obstacles;
        this.edges = obstacles.flat();
        this.graph = null;
    }

    /**
     * @param {Vec2} point
     * @returns {boolean}
     */
    intersectsPolygon(point) {
        let isInside = false;
        let j = this.obstacles.length - 1;
        for (let i = 0; i < this.obstacles.length; i++) {
            let x1 = this.obstacles[i].x;
            let y1 = this.obstacles[i].y;
            let x2 = this.obstacles[j].x;
            let y2 = this.obstacles[j].y;

            if (
                ((y1 > point.y) !== (y2 > point.y)) &&
                (x < (x2 - x1) * (point.y - y1) / (y2 - y1) + x1)
            ) {
                isInside = !isInside;
            }

            j = i;
        }

        return isInside;
    }

    /**
     * @returns {{ p1: Vec2, p2: Vec2, distance: number }[]} graph
     */
    buildVisibilityGraph() {
        // {p1: vec2, p2: vec2, distance: number}
        const visibilityGraph = new Graph();
    
        for (let i = 0; i < this.edges.length; i++) {
            for (let j = i; j < this.edges.length; j++) {
                if (i !== j &&
                    !this.intersectsPolygon(this.edges[i]) &&
                    !this.intersectsPolygon(this.edges[j])
                ) {
                    const a = this.edges[i];
                    const b = this.edges[j];
                    const distance = a.distance(b);
                    visibilityGraph.addEdge(a.toString(), b.toString(), distance);
                    visibilityGraph.addEdge(b.toString(), a.toString(), distance);
                }
            }
        }
        return visibilityGraph;
    }
}

class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    /**
     * 
     * @param {*} item 
     * @param {number} priority 
     */
    enqueue(item, priority) {
        this.queue.push({ item, priority });
        this.queue = this.queue.sort((a, b) => b.priority - a.priority);
    }

    dequeue() {
        const e = this.queue.shift();
        return typeof e === 'undefined' ? null : e.item;
    }

    pop() {
        const e = this.queue.pop();
        return typeof e === 'undefined' ? null : e.item;
    }

    decreaseKey(item, priority) {
        this.queue = this.queue.filter(({ item }) => item !== item);
        this.enqueue(item, priority);
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

class Graph {
    constructor() {
        this.vertices = [];
        this.edges = {};
        this.numVertex = -1;
        this.numEdges = -1;
    }

    addNode(n) {
        if (!this.vertices.includes(n)) {
            this.vertices.push(n);
        }
    }

    addEdge(from, to, weight) {
        this.addNode(from);
        if (!Object.prototype.hasOwnProperty.call(this.edges, from)) {
            this.edges[from] = {};
        }
        this.edges[from][to] = weight;
    }
}

/**
 * @param {Graph} graph 
 */
function prim(graph) {
    const pq = new PriorityQueue();
    const visited = new Set();
    const mst = new Graph();
    const edges = graph.edges;

    let v = graph.vertices[0];
    visited.add(v);

    Object.entries(edges[v]).forEach(([vertice, weight]) => {
        pq.enqueue([ v, vertice ], weight);
    });

    let minEdge = pq.dequeue();
    while (!pq.isEmpty()) {
        while (!pq.isEmpty() && visited.has(minEdge[1])) {
            minEdge = pq.dequeue();
        }

        let nextNode = minEdge[1];

        if (!visited.has(nextNode)) {
            mst.addEdge(minEdge[0], nextNode, edges[minEdge[0]][nextNode]);

            Object.entries(edges[nextNode]).forEach(([vertice, weight]) => {
                pq.enqueue([ nextNode, vertice ], weight);
            });

            visited.add(nextNode);
        }
    }

    return mst;
}

class Kruskal {
    /**
     * @constructor
     * @param {Graph} graph 
     */
    constructor(graph) {
        this.graph = graph;
        this.mst = [];//new Graph();
        this.parent = {};
    }

    find(i) {
        while (this.parent[i] !== i)
            i = this.parent[i];
        return i;
    }

    union(a, b) {
        this.parent[this.find(a)] = this.find(b);
    }

    run() {
        let minCost = -1;
        let edgeCount = Object.keys(this.graph.edges).length;
        let k = edgeCount;
        
        while (k--) {
            let min = Number.MIN_SAFE_INTEGER;
            let a = -1;
            let b = -1;
            for (const i of Object.keys(this.graph.edges)) {
                for (const j of Object.keys(this.graph.edges)) {
                    if (this.find(i) !== this.find(j) && this.graph.edges[i][j] < min) {
                        min = this.graph.edges[i][j];
                        a = i;
                        b = j;
                    }
                }
            }
            this.union(a, b);
        }
    }
}

/**
 * 
 * @param {Vec2} start 
 * @param {Vec2} end 
 * @param {Graph} tree
 */
function robot_path(start, end, tree) {
    const oldStartEnd = [ start, end ];

    for (let i = 0; i < oldStartEnd.length; i++) {
        let nearestVertice = null;
        let nearestVerticeDistance = Number.MAX_SAFE_INTEGER;

        for (const vertice of tree.vertices) {
            const v = new Vec2(...vertice.match(/\d+(\.\d+)?/g).map(Number));
            const d = v.distance(oldStartEnd[i]);

            if (nearestVerticeDistance > d) {
                nearestVertice = v;
                nearestVerticeDistance = d;
            }
        }

        oldStartEnd[i] = nearestVertice;
    }

    start = oldStartEnd[0].toString();
    end = oldStartEnd[1].toString();

    function dijkstra() {
        const pq = new PriorityQueue();
        const distances = {};
        const prev = {};

        Array.from(new Set([
            ...Object.keys(tree.edges),
            ...Object.values(tree.edges).map(x => Object.keys(x)).flat()
        ])).forEach(v => {
            distances[v] = Infinity;
            pq.enqueue(v, Infinity);
        });

        distances[start] = 0;
        pq.decreaseKey(start, 0);
        prev[start] = null;

        while (!pq.isEmpty()) {
            const smallest = pq.pop();
            const adjList = Object.keys(tree.edges?.[smallest] || {});
            for (const v of adjList) {
                const w = distances[smallest] + tree.edges[smallest][v];
                if (w < distances[v]) {
                    distances[v] = w;
                    pq.enqueue(v, distances[v]);
                    prev[v] = smallest;
                }
            }
        }

        console.dir({ prev, start, end });
    }

    dijkstra();
}

~(function main() {
    const { start, end, obstacles } = readFile(__mapInput);
    //console.dir({ start, end, obstacles }, { depth: null });
    //const algorithm = "KRUSKAL";
    const algorithm = "PRIM";

    const vg = new VisibilityGraph(obstacles);
    const visibilityGraph = vg.buildVisibilityGraph();
    let mst;
    if (algorithm === 'PRIM') {
        mst = prim(visibilityGraph);
    } else if (algorithm === 'KRUSKAL') {
        mst = new Kruskal(visibilityGraph);
        mst.run();
        mst = mst.mst;
    } else {
        console.error('Algorítmo inválido. Os valores válidos são "PRIM" e "KRUSKAL"');
    }

    console.dir(mst);
    robot_path(start, end, mst)
})();
