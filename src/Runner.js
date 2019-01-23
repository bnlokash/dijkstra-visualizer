import React, { Component } from "react";
import { connect } from "react-redux";
import {
  addNode,
  removeNode,
  addEdge,
  removeEdge,
  removeEdgeAll,
  setStart,
  setEnd,
  setDist,
  updateStatus
} from "./actions";

class Runner extends Component {
  constructor() {
    super();
    this.state = {
      done: true
    };
    this.runDijkstra = this.runDijkstra.bind(this);
    this.step = this.step.bind(this);
  }

  render() {
    return (
      <div>
        <button onClick={this.runDijkstra}>Start</button>
        <button onClick={this.step} disabled={this.state.done}>
          Step
        </button>
      </div>
    );
  }

  runDijkstra() {
    this.initNodes();
  }

  initNodes() {
    this.setState({
      done: false
    });
    let currentProps = JSON.parse(JSON.stringify(this.props));
    let { nodes, edges, start, end } = currentProps;
    for (let n of nodes) {
      n.adjacent = [];
      n.prev = -1;
      n.visited = false;
      n.value = Number.MAX_SAFE_INTEGER;
      for (let e of edges) {
        if (e.from === n.name) {
          n.adjacent.push({ to: e.to, dist: e.dist });
        } else if (e.to === n.name) {
          n.adjacent.push({ to: e.from, dist: e.dist });
        }
      }
      n.start = n.name === start;
      n.end = n.name === end;
    }
    this.props.onUpdateStatus({ nodes, visiting: null });
  }

  step() {
    let currentStatus = JSON.parse(JSON.stringify(this.props.status));
    let { nodes, visiting } = currentStatus;
    let node = null;
    if (!visiting) {
      node = nodes.find(n => {
        return n.start === true;
      });
      node.value = 0;
    } else {
      node = this.findSmallestUnvisited(nodes);
    }
    this.updateAdjacent(node, nodes);
    node.visited = true;
    if (!this.unvisitedRemain(nodes)) {
      this.setState({ done: true });
    }
    this.props.onUpdateStatus({ nodes, visiting: node.name });
  }

  findNode(name, nodes) {
    return nodes.find(n => {
      return n.name === name;
    });
  }

  updateAdjacent(node, nodes) {
    console.log("update adjacent", node.name);
    for (let adjNode of node.adjacent) {
      let adj = this.findNode(adjNode.to, nodes);
      let updatedValue = adjNode.dist + node.value;
      if (updatedValue < adj.value) {
        adj.value = updatedValue;
        adj.prev = node.name;
      }
    }
  }

  firstStep() {
    let currentStatus = JSON.parse(JSON.stringify(this.props.status));
    let { nodes, visiting } = currentStatus;
    if (!visiting) {
    }
    let node = nodes.find(n => {
      return n.start === true;
    });
    node.value = 0;
    this.updateAdjacent(node, nodes);
    node.visited = true;
    this.props.onUpdateStatus({ nodes, visiting: node.name });
  }

  findSmallestUnvisited(nodes) {
    let smallestValue = Number.MAX_SAFE_INTEGER;
    let smallestNode = null;
    for (let n of nodes) {
      if (!n.visited && n.value < smallestValue) {
        smallestValue = n.value;
        smallestNode = n;
      }
    }
    return smallestNode;
  }

  unvisitedRemain(nodes) {
    return nodes.find(n => n.visited !== true) ? true : false;
  }
}

const mapStateToProps = state => {
  return {
    nodes: state.nodes,
    edges: state.edges,
    start: state.start,
    end: state.end,
    status: state.status
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddNode: name => dispatch(addNode(name)),
    onRemoveNode: name => dispatch(removeNode(name)),
    onAddEdge: (from, to) => dispatch(addEdge(from, to)),
    onRemoveEdge: (from, to) => dispatch(removeEdge(from, to)),
    onRemoveEdgeAll: from => dispatch(removeEdgeAll(from)),
    onSetStart: name => dispatch(setStart(name)),
    onSetEnd: name => dispatch(setEnd(name)),
    onSetDist: (from, to, dist) => dispatch(setDist(from, to, dist)),
    onUpdateStatus: status => dispatch(updateStatus(status))
  };
};

const ConnectedRunner = connect(
  mapStateToProps,
  mapDispatchToProps
)(Runner);

export default ConnectedRunner;
