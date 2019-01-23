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

class Chart extends Component {
  render() {
    const { visiting } = this.props.status;
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Currently Visiting: {visiting ? visiting : ""}</th>
            </tr>
            <tr>
              <th>Node</th>
              <th>Shortest Distance</th>
              <th>Through Previous Node</th>
            </tr>
          </thead>
          <tbody>
            {this.props.status.nodes.map((n, i) => {
              return (
                <tr key={i}>
                  <td>{n.name}</td>
                  <td>
                    {n.value === Number.MAX_SAFE_INTEGER ? "inf." : n.value}
                  </td>
                  <td>{n.prev}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.status
  };
};

const ConnectedChart = connect(mapStateToProps)(Chart);

export default ConnectedChart;
