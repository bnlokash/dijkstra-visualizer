import * as actions from '../actions.js';
import dijkstraApp from '../reducers.js';

describe('node actions', ()=>{
  it('should create an action to add a node', () => {
    const name = 'A';
    const expectedAction = {
      id: 0,
      type: actions.ADD_NODE,
      name
    }
    expect(actions.addNode(name)).toEqual(expectedAction)
  });
  it('should create an action to remove a node', () => {
    const name = 'B';
    const expectedAction = {
      type: actions.REMOVE_NODE,
      name
    }
    expect(actions.removeNode(name)).toEqual(expectedAction)
  });
});

describe('edge actions', () => {
  it('should create an action to add an edge', ()=>{
    const from = 'A';
    const to = 'B';
    const expectedAction = {
      type: actions.ADD_EDGE,
      id: 0,
      from,
      to
    }
    expect(actions.addEdge(from, to)).toEqual(expectedAction)
  });

  it('should create an action to remove an edge', () => {
    const from = 'A';
    const to = 'B';
    const expectedAction = {
      type: actions.REMOVE_EDGE,
      from,
      to
    }
    expect(actions.removeEdge(from, to)).toEqual(expectedAction);
  })
});

