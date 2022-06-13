/*
const { readFileSync } = require('fs');
const graph01 = readFileSync('./grafo01.txt').toString('utf-8');
const graph02 = readFileSync('./grafo02.txt').toString('utf-8');
*/
const graph01 = `12  22
1   2   17
1   3   25
1   5   21
2   4   10
2   6   15
3   7   20
4   6   9
4   8   23
5   6   12
5   7   19
6   8   8
6   9   7
7   9   17
7   11  12
7   12  22
8   9   10
8   10  13
9   10  12
9   11  15
10  11  14
10  12  21
11  12  10`;

const graph02 = `10  31
1   2   10
1   5   3
1   7   5
2   1   5
2   4   3
2   6   3
3   1   6
3   4   8
3   6   8
4   5   10
4   6   1
4   2   5
5   6   20
5   10  8
5   9   11
6   7   20
6   10  12
6   8   5
7   3   2
7   5   7
8   7   2
8   9   12
8   10  3
9   5   2
9   6   20
9   8   4
10  1   5
10  3   7
10  5   4
10  8   20
10  9   6`;

function gerarMatriz(linhas, colunas, fill = 0) {
    return Array(linhas).fill().map(_ => Array(colunas).fill(fill));
}

/**
 * Leitura do arquivo:
 * <num_vertices> <num_arestas>
 * <vertice_inicial> <vertice_final> <custo> (repetição para cada aresta)
 * 
 * O grafo 1 é não-direcionado
 * O grafo 2 é direcionado
 */
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

function readGraph(graphObj, rawFile, isDirected) {
    const lines = rawFile.split(/\n+/g);
    const [ numVertex, numEdges ] = lines.shift().split(/ +/).map(Number);

    graphObj.numVertex = numVertex;
    graphObj.numEdges = numEdges;
    
    for (const line of lines) {
        const [ from, to, weight ] = line.split(/ +/g).map(Number);
        
        graphObj.addEdge(from, to, weight);

        if (isDirected) {
            graphObj.addEdge(to, from, weight);
        }
    }
}

function gerar_tabela_dist(graph) {
    const vertices = graph.vertices;
    const dist = gerarMatriz(vertices.length, vertices.length, -1);

    vertices.forEach((from, i) => {
        vertices.forEach((to, j) => {
            if (from === to) {
                dist[i][j] = 0;
            } else {
                const edge = graph.edges[from][to];

                if (!isNaN(edge)) {
                    dist[i][j] = edge; // edge = peso
                } else {
                    dist[i][j] = Infinity;
                }
            }
        });
    });

    vertices.forEach((_, i) => {
        vertices.forEach((_, j) => {
            vertices.forEach((_, k) => {
                if (dist[i][j] > dist[i][k] + dist[k][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            });
        });
    })

    return dist;
}

function dist_sum_vec(dist) {
    const sum = [];
    for (line of dist) {
        sum.push(line.reduce((a, b) => a + b, 0));
    }
    return sum;
}

function max_dist_vec(dist) {
    const max = [];
    let currMax;
    for (const line of dist) {
        currMax = -Infinity;
        for (const n of line) {
           currMax = Math.max(currMax, n);
        }
        max.push(currMax);
    }
    return max;
}

function centralStation(dist) {
    const sumDist = dist_sum_vec(dist);
    const maxDist = max_dist_vec(dist);
    const minVal = sumDist.reduce((a, b) => Math.min(a, b), Infinity);
    const minIndex = sumDist.indexOf(minVal);

    return minIndex + 1;
}

~(function main() {
    const graph = new Graph();
    readGraph(graph, graph01, false)
    //readGraph(graph, graph02, true)
    
    const dist = gerar_tabela_dist(graph);

    console.log(dist.join('\n') + '\n');
    console.log(dist_sum_vec(dist).join(' ') + '\n');
    console.log(max_dist_vec(dist).join(' ') + '\n');
    console.log(centralStation(dist));
})();
