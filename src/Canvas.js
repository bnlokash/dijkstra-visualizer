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
  setDist
} from "./actions";
import paper from "paper";

class Canvas extends Component {
  constructor() {
    super();
    this.letters = [
      "Z",
      "Y",
      "X",
      "W",
      "V",
      "U",
      "T",
      "S",
      "R",
      "Q",
      "P",
      "O",
      "N",
      "M",
      "L",
      "K",
      "J",
      "I",
      "H",
      "G",
      "F",
      "E",
      "D",
      "C",
      "B",
      "A"
    ];
    this.currentValues = [];
    this.papertest = this.papertest.bind(this);

    //path tool
    this.startNodeId = null;
    this.setNodeToolActive = this.setNodeToolActive.bind(this);
    this.setPathToolActive = this.setPathToolActive.bind(this);
    this.setStartToolActive = this.setStartToolActive.bind(this);
    this.setFinishToolActive = this.setFinishToolActive.bind(this);

    //path inputs
    this.pathInputs = [];
  }

  componentDidMount() {
    this.papertest();
  }

  componentDidUpdate() {
    let { visiting, nodes } = this.props.status;
    if (visiting) {
      // if visiting then this is a subsequent step

      // mark visiting node in yellow
      let item = this.getItemsById(visiting)[0];
      item.fillColor = "yellow";
      let node = nodes.find(n => n.name === visiting);
      // first node should have a value of 0
      if (node.start) {
        this.drawUpdatedValue(node.name, 0);
      }
      // update shortest distance values of adjacent nodes
      for (let n of node.adjacent) {
        this.drawUpdatedValue(n.to, n.dist + node.value);
      }
    } else {
      // if !visiting then this is the first step, initialize values
      for (let n of nodes) {
        this.drawInitialValue(n.name, n.value);
      }
    }
  }

  render() {
    return (
      <div>
        <canvas id="myCanvas" height="600" width="840" />
        <form>
          <input
            type="radio"
            id="nodeTool"
            name="tool"
            onClick={this.setNodeToolActive}
            defaultChecked
          />
          <label htmlFor="nodeTool">Node Tool</label>
          <input
            type="radio"
            name="tool"
            id="pathTool"
            onClick={this.setPathToolActive}
          />
          <label htmlFor="pathTool">Path Tool</label>
          <input
            type="radio"
            id="startTool"
            name="tool"
            onClick={this.setStartToolActive}
          />
          <label htmlFor="startTool">Set Starting Node</label>
          <input
            type="radio"
            name="tool"
            id="finishTool"
            onClick={this.setFinishToolActive}
          />
          <label htmlFor="finishTool">Set Ending Node</label>
        </form>
      </div>
    );
  }

  papertest() {
    this.canvas = document.getElementById("myCanvas");
    paper.setup(this.canvas);

    this.nodeTool = new paper.Tool();

    this.nodeTool.onMouseUp = event => {
      let hitTest = paper.project.hitTest(event.point);
      if (hitTest) {
        const { id } = hitTest.item.data;
        this.removeItemsById(id);
        this.removeConnectingPaths(id);
      } else {
        this.drawNode(event.point);
      }
    };

    this.pathTool = new paper.Tool();

    this.pathTool.onMouseDown = event => {
      let hit = this.hitTest(event.point);
      if (hit) {
        this.startNodeId = hit.item.data.id;
      } else {
        this.startNodeId = null;
      }
    };

    this.pathTool.onMouseUp = event => {
      let hit = this.hitTest(event.point);
      if (hit) {
        let endNodeId = hit.item.data.id;
        if (this.startNodeId && endNodeId && this.startNodeId !== endNodeId) {
          this.drawPath(this.startNodeId, endNodeId);
          this.startNodeId = null;
        }
      } else {
        this.startNodeId = null;
      }
    };

    this.startTool = new paper.Tool();
    this.finishTool = new paper.Tool();

    this.startTool.onMouseUp = event => {
      let hit = this.hitTest(event.point);
      if (hit) {
        let clickedNode = this.getItemsById(hit.item.data.id)[0];
        this.setStart(clickedNode);
      }
    };

    this.finishTool.onMouseUp = event => {
      let hit = this.hitTest(event.point);
      if (hit) {
        let clickedNode = this.getItemsById(hit.item.data.id)[0];
        this.setEnd(clickedNode);
      }
    };
  }

  getNextLetter() {
    return this.letters.pop();
  }

  putBackLetter(letter) {
    this.letters.push(letter);
  }

  getItemsById(id) {
    return paper.project.getItems({
      match: item => {
        return item.data.id === id;
      }
    });
  }

  getPaths() {
    return paper.project.getItems({
      match: item => {
        return item.data.path;
      }
    });
  }

  hitTest(point) {
    return paper.project.hitTest(point);
  }

  removeConnectingPaths(id) {
    let paths = this.getPaths();
    for (let p of paths) {
      const { from, to } = p.data;
      if (from === id || to === id) {
        p.data.input.remove();
        p.remove();
      }
    }
  }

  removeItemsById(id) {
    let items = this.getItemsById(id);
    let letter = null;
    for (let i of items) {
      letter = i.data.id;
      i.remove();
    }
    if (letter) {
      this.putBackLetter(letter);
      this.props.onRemoveNode(letter);
    }
  }

  stateIncludesEdge(idA, idB) {
    // exists so drawPath can avoid drawing duplicate paths (aka edges)
    if (
      this.props.edges.find(edge => {
        if (edge.from === idA && edge.to === idB) {
          return true;
        }
        if (edge.from === idB && edge.to === idA) {
          return true;
        }
        return false;
      })
    ) {
      return true;
    } else return false;
  }

  rand() {
    return Math.floor(Math.random() * 3 + 1);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ////////////////////////
  // DRAW FUNCTIONS //////
  ///////////////////////
  drawInput(point, from, to) {
    let input = document.createElement("input");
    input.type = "text";
    input.style.position = "absolute";
    input.style.top = `${point.y}px`;
    input.style.left = `${point.x}px`;
    input.style.width = "20px";
    input.value = this.rand();
    document.body.appendChild(input);
    input.onkeyup = event => {
      const dist = parseInt(event.target.value);
      this.props.onSetDist(from, to, isNaN(dist) ? 0 : dist);
    };
    return input;
  }

  drawPath(idA, idB) {
    if (!this.stateIncludesEdge(idA, idB)) {
      let itemA = this.getItemsById(idA)[0];
      let itemB = this.getItemsById(idB)[0];
      let path = new paper.Path.Line({
        from: [itemA.position.x, itemA.position.y],
        to: [itemB.position.x, itemB.position.y],
        strokeColor: "black",
        strokeWidth: 10,
        data: { path: true, from: itemA.data.id, to: itemB.data.id }
      });
      path.sendToBack();
      path.data.input = this.drawInput(path.position, idA, idB);
      this.props.onAddEdge(idA, idB, Number.parseInt(path.data.input.value));
    }
  }

  drawNode(point) {
    let first = this.props.nodes.length === 0;
    let last = this.props.nodes.length === 26;
    let letter = this.getNextLetter();
    if (letter) {
      let circle = new paper.Shape.Circle({
        center: point,
        radius: 25,
        strokeColor: "black",
        fillColor: "white",
        data: { id: letter }
      });

      let text = new paper.PointText({
        point: [point.x - 6, point.y + 7],
        content: letter,
        fillColor: "black",
        fontSize: 20,
        data: { id: letter }
      });
      this.props.onAddNode(letter);
      if (first) {
        this.setStart(circle);
      }
      if (last) {
        this.setEnd(circle);
      }
    }
  }

  drawInitialValue(name, value) {
    let item = this.getItemsById(name)[0];
    value = value === Number.MAX_SAFE_INTEGER ? "\u221E" : value;
    let valueText = new paper.PointText({
      point: [item.position.x - 6, item.position.y - 24],
      content: value,
      fillColor: "red",
      fontSize: 24,
      data: { belongsTo: name }
    });
    this.currentValues.push(valueText);
  }

  async drawUpdatedValue(name, value) {
    let text = this.currentValues.find(cV => cV.data.belongsTo === name);
    console.log(value, text.content);
    let content = text.content;
    let willUpdate = null;
    let valuesEqual = null;
    // update text if new value is less than current OR current is the infinity character
    if (value < parseInt(content) || content === "\u221E") {
      willUpdate = true;
    } else {
      if (value === parseInt(content)) valuesEqual = true;
    }
    if (willUpdate) {
      let equation = `${content} > ${value}`;
      text.content = equation;
      await this.sleep(2000);
      text.content = value;
    } else {
      if (valuesEqual) {
        let equation = `${content} = ${value}`;
        text.content = equation;
        await this.sleep(2000);
        text.content = content;
      } else {
        let equation = `${content} < ${value}`;
        text.content = equation;
        await this.sleep(2000);
        text.content = content;
      }
    }
  }
  ////////////////////////////

  //////////////////
  // TOOLS ////////
  /////////////////

  setNodeToolActive() {
    this.nodeTool.activate();
  }

  setPathToolActive() {
    this.pathTool.activate();
  }

  setStartToolActive() {
    this.startTool.activate();
  }

  setFinishToolActive() {
    this.finishTool.activate();
  }

  setStart(clickedNode) {
    if (clickedNode !== this.endingNode) {
      if (this.startingNode) {
        this.startingNode.fillColor = "white";
      }
      this.startingNode = clickedNode;
      this.startingNode.fillColor = "green";
      this.props.onSetStart(clickedNode.data.id);
    }
  }

  setEnd(clickedNode) {
    if (clickedNode !== this.startingNode) {
      if (this.endingNode) {
        this.endingNode.fillColor = "white";
      }
      this.endingNode = clickedNode;
      this.endingNode.fillColor = "red";
      this.props.onSetEnd(clickedNode.data.id);
    }
  }

  ////////////////
} // END CANVAS

const mapStateToProps = state => {
  return {
    nodes: state.nodes,
    edges: state.edges,
    status: state.status,
    start: state.start,
    end: state.end
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddNode: name => dispatch(addNode(name)),
    onRemoveNode: name => {
      dispatch(removeNode(name));
    },
    onAddEdge: (from, to, dist) => dispatch(addEdge(from, to, dist)),
    onRemoveEdge: (from, to) => dispatch(removeEdge(from, to)),
    onRemoveEdgeAll: from => dispatch(removeEdgeAll(from)),
    onSetStart: name => dispatch(setStart(name)),
    onSetEnd: name => dispatch(setEnd(name)),
    onSetDist: (from, to, dist) => dispatch(setDist(from, to, dist))
  };
};

const ConnectedCanvas = connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);

export default ConnectedCanvas;
