// Current robot position
const robot_pos_c = [2,2];
// Desired robot position
const robot_pos_d = [9,9];

const inf = Infinity;
const occupancy = [
    [inf,   1,   1,   1,   1, inf, inf, inf,   1,   1],
    [inf,   1,   1,   1,   1, inf, inf, inf,   1,   1],
    [inf,   1,   1,   1,   1, inf, inf, inf,   1,   1],
    [inf,   1,   1,   1,   1,   1,   1,   1,   1,   1],
    [inf,   1,   1,   1,   1,   1,   1,   1,   1,   1],
    [inf, inf, inf, inf, inf, inf,   1,   1, inf,   1],
    [  1,   1,   1,   1,   1, inf,   1,   1, inf,   1],
    [  1,   1,   1, inf,   1, inf,   1,   1, inf,   1],
    [  1,   1,   1, inf,   1,   1,   1,   1, inf,   1],
    [  1,   1,   1,   1,   1,   1,   1,   1, inf,   1]
];

class Node {
    /**
     * @constructor
     * @param {[number, number]} position - [x, y]
     * @param {Node} [parent=null] - Parent node
     */
    constructor(position, parent = null) {
        this.parent = parent;
        this.x = position[0];
        this.y = position[1];
        this.weight = occupancy[this.y][this.x];
        this.g = 0;
        this.h = 0;
    }

    f() {
        return this.g + this.h;
    }

    /**
     * @returns {Node[]} node list
     */
    generateChildren() {
        const children = [];

        for (const [ offsetX, offsetY] of [
            [0, 1], [0, -1], [1, 0], [-1, 0]
        ]) {
            const childPosX = this.x + offsetX;
            const childPosY = this.y + offsetY;

            if (
                // Check boundaries of Y axis
                childPosY < 0 || childPosY >= occupancy.length
                // Check boundaries of X axis
                || childPosX < 0 || childPosX >= occupancy[childPosY].length
                // Check if node is an obstacle
                || occupancy[childPosY][childPosX] === Infinity
            ) {
                continue;
            }

            const child = new Node([ childPosX, childPosY ], this);
            children.push(child);
        }

        return children;
    }
}

/**
 * @param {[number, number]} currentPos - [x, y] 
 * @param {[number, number]} desiredPos - [x, y] 
 * @param {number[][]} map - Occupancy matrix
 */
function robot_path(currentPos, desiredPos) {
    const start = new Node(currentPos);
    const end = new Node(desiredPos);

    let openSet = [ start ];
    const closedSet = [];

    while (openSet.length > 0) {
        openSet = openSet.filter(n => n.weight !== Infinity)
        let currNode = openSet[0];
        let currIndex = 0;

        openSet.forEach((item, i) => {
            if (item.f() < currNode.f()) {
                currNode = item;
                currIndex = i;
            }
        });

        openSet.splice(currIndex, 1);
        closedSet.push(currNode);

        if (
            // Compare X position
            currNode.x === end.x
            // Compare Y position
            && currNode.y === end.y
        ) {
            const path = [];
            let curr = currNode;
            while (curr !== null) {
                path.unshift(curr);
                curr = curr.parent;
            }
            return path;
        }

        // Generate children
        const children = currNode.generateChildren();

        for (const child of children) {
            // Check if child is in closed list
            if (closedSet.find(node => node.x === child.x && node.y === child.y)) {
                continue;
            }

            // Heuristics!!!!11!
            child.g = currNode.g + child.weight;
            child.h = Math.abs(child.x - end.x) ** 1.25 + Math.abs(child.y - end.y) ** 1.25;

            // Check open list
            if (openSet.find(node =>
                node.x === child.x && node.y === child.y && child.g > node.g
            )) {
                continue;
            }

            openSet.push(child);
        }
    }
}

function printPath(nodeList) {
    if (Array.isArray(nodeList)) {
        console.log(nodeList.map(node => `[${node.x},${node.y}]`).join(' -> '));
        console.log('');
    } else {
        console.log('Sem solução');
    }
}

function printMap(path) {
    let x = 0, y = 0;

    for (const row of occupancy) {
        for (let i = 0; i < 2; i++) { // Just makes the map bigger
            x = 0;
            for (const space of row) {
                if (space === Infinity) { // Obstacle
                    color = '\x1b[41m'; // Red
                } else if (x === robot_pos_c[0] && y === robot_pos_c[1]) { // Start
                    color = '\x1b[46m'; // Cyan
                } else if (x === robot_pos_d[0] && y === robot_pos_d[1]) { // Target
                    color = '\x1b[44m'; // Blue
                } else if (path && path.find(node => node.x === x && node.y === y)) { // Make the path green!
                    color = '\x1b[42m'; // Green
                } else {
                    color = '\x1b[47m'; // White
                }

                if (i == 0) {
                    process.stdout.write(`${color}${x},${y} `);
                } else {
                    process.stdout.write(`${color}    `);
                }

                x++;
            }
            process.stdout.write('\n\x1b[0m');
        }
        y++;
    }
}

~(function main() {
    const startTime = Date.now();
    const path = robot_path(robot_pos_c, robot_pos_d);
    const endTime = Date.now();

    console.log('Execução:', endTime - startTime, 'ms');

    printPath(path);
    printMap(path);
})();
