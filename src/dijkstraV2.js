const dijkstraFactory = graph => {
  let {nodes, edges, start, end} = graph;
  let visiting = null;

  function initNodes() {
    console.log('init');
    for (let n of nodes) {
      n.adjacent = [];
      n.prev = -1;
      n.visited = false;
      n.value = Number.MAX_SAFE_INTEGER;
      for (let e of edges) {
        if (e.from === n.name) {
          n.adjacent.push({to: e.to, dist: e.dist});
        } else if (e.to === n.name) {
          n.adjacent.push({to: e.from, dist: e.dist});
        }
      }
      n.start = n.name === start;
      n.end = n.name === end;
    }
    console.log(nodes);
  }

  function run() {
    initNodes();
    firstStep();
    while(unvisitedRemain()){
      step();
    }
  }

  function step() {
    console.log('step');
    let node = findSmallestUnvisited();
    updateAdjacent(node);
    node.visited = true;
    console.log(nodes);
  }

  function findNode(name) {
    return nodes.find((n)=> {
      return n.name === name;
    })
  }


  function updateAdjacent(node) {
    console.log('update adjacent', node.name);
    for (let adjNode of node.adjacent) {
      let adj = findNode(adjNode.to);
      let updatedValue = adjNode.dist + node.value;
      if (updatedValue < adj.value) {
        adj.value = updatedValue;
        adj.prev = node.name;
      }
    }
  }

  function firstStep() {
    console.log('first step');
    let node = nodes.find((n)=>{
      return n.start === true;
    });
    node.value = 0;
    updateAdjacent(node);
    node.visited = true;
    visiting = node.name;
    return Object.assign({}, nodes);
    console.log(nodes);
  }

  function findSmallestUnvisited() {
    let smallestValue = Number.MAX_SAFE_INTEGER;
    let smallestNode = null;
    for (let n of nodes) {
      if (!n.visited && (n.value < smallestValue)) {
        smallestValue = n.value;
        smallestNode = n;
      }
    }
    return smallestNode;
  }

  function unvisitedRemain() {
    return nodes.find(n => n.visited !== true) ? true : false;
  }
  

  return {
    nodes,
    run,
    step,
    firstStep,
    initNodes,
    unvisitedRemain
  }
  
}

export default dijkstraFactory;