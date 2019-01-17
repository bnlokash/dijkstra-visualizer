const grid = [
  [2, 3, 9],
  [6, 5, 4],
  [1, 9, 1]
]


// square grid only
const dijkstraFactory = (g) => {
  let unvisited = [];
  let visited = [];
  let dist = [];
  let adjacent = [];
  let grid = g;
  let values = [];
  const INFINITE = Number.MAX_SAFE_INTEGER;
  let idCounter = 0;
  let prev = [];  

  let rows = grid.length;
  let columns = grid[0].length;
  const idGen = () => {
    return idCounter++;
  }

  const initNodes = () => {
    for (let m = 0; m < rows; m++) {
      for (let n = 0; n < columns; n++) {
        if (m == 0 && n == 0) {
          dist.push(grid[0][0]);
          unvisited.push(idGen());
          prev.push(-1);
          adjacent.push([1, columns]);
          values.push(grid[m][n]);
        } else {
          let id = idGen();
          dist.push(INFINITE);
          unvisited.push(id);
          prev.push(-1);
          // begin logic for find adjacent
          if (n == columns-1 && m == rows-1) { // last column in last row
            adjacent.push([null])
          } else if (n == columns-1 && m != rows-1) { // last column in row
            adjacent.push([id+columns]);
          } else if (m == rows-1) { // last row
            adjacent.push([id+1])
          } else {
            adjacent.push([id+1, id+columns]);
          }
          values.push(grid[m][n]);
        }
      }
    }
    console.info('init');
    console.info('dist', dist);
    console.info('visited', visited);
    console.info('unvisited', unvisited);
    console.info('prev', prev);
    console.info('values', values);
    console.info('adjacent', adjacent);
  }

  const indexOfSmallestUnvisited = () => {
    let indexOfSmallest = null;
    let smallestDist = INFINITE+1;
    for (let e = 0; e < unvisited.length; e++ ) {
      if (dist[unvisited[e]] < smallestDist) {
        smallestDist = dist[unvisited[e]];
        indexOfSmallest = e;
      }
    }
    return indexOfSmallest;
  }

  const visitNext = () => {
    let smallestUnvisitedIndex = indexOfSmallestUnvisited();
    let visiting = unvisited[smallestUnvisitedIndex];
    visit(visiting);
    visited.push(visiting);
    unvisited.splice(smallestUnvisitedIndex, 1);
  }

  const visit = (node) => {
    let adjacentNodes = adjacent[node];
    if (adjacentNodes[0] !== null){
      for (let e = 0; e < adjacentNodes.length; e++){
        let nextAdj = adjacentNodes[e]
        let prevDistance = dist[nextAdj];
        let tempDistance = values[nextAdj] + dist[node];
        if (tempDistance < prevDistance) {
          dist[nextAdj] = tempDistance;
          prev[nextAdj] = node;
        } 
      }
    }
  }

  const printPath = () => {
    let printMe = '!!';
    let currentIndex = values.length-1;
    do {
      printMe = `-> ${values[currentIndex]} [${currentIndex}] `.concat(printMe);
      currentIndex = prev[currentIndex];
    } while(prev[currentIndex] !== -1)
    printMe = `${values[0]} [0] `.concat(printMe);
    console.log(printMe);
    console.log(`Distance: ${dist[dist.length-1]}`);
  }

  const run = () => {
    initNodes();
    while(unvisited.length > 0) {
      visitNext();
    }
    printPath();
  }
  
  return {
    run: run
  }

}

const minPathSum = function(grid) {
  const dijkstra = dijkstraFactory(grid);
  dijkstra.run();
}

minPathSum(grid);