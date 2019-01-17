import * as actions from '../actions.js';
import dijkstraApp from '../reducers.js';

describe('nodes reducer', () => {
  it('should return the initial state', () => {
    expect(dijkstraApp(undefined, {})).toEqual({
      nodes: [],
      edges: [],
      start: null,
      end: null
    })
  });

  it('should handle ADD_NODE', () => {
    // add node to undefined initial state
    expect(
      dijkstraApp(undefined, {
        type: actions.ADD_NODE,
        id: 0,
        name: 'A'
      })
    ).toEqual({
      nodes: [
        {id: 0, name: 'A'}
      ],
      edges: [],
      start: null,
      end: null
    });

    // add node to existing state
    expect(
      dijkstraApp({
        nodes: [
          {id: 0, name: 'A'}
        ]
      }, {
        type: actions.ADD_NODE,
        id: 1,
        name: 'B'
      })
    ).toEqual({
      nodes: [
        {id: 0, name: 'A'},
        {id: 1, name: 'B'}
      ],
      edges: [],
      start: null,
      end: null
    });
  });

  it('should handle REMOVE_NODE', () => {
    // remove node from undefined initial state
    expect(
      dijkstraApp(undefined, {
        type: actions.REMOVE_NODE,
        name: 'A'
      })
    ).toEqual({
      nodes: [],
      edges: [],
      start: null,
      end: null
    });

    // remove B node from [A, B, C]
    expect(
      dijkstraApp({
        nodes: [
          {id: 0, name: 'A'},
          {id: 1, name: 'B'},
          {id: 2, name: 'C'}
        ]
      }, {
        type: actions.REMOVE_NODE,
        name: 'B'
      })
    ).toEqual({
      nodes: [
        {id: 0, name: 'A'},
        {id: 2, name: 'C'}
      ],
      edges: [],
      start: null,
      end: null
    });

    // remove C node from [A, B]
    expect(
      dijkstraApp({
        nodes: [
          {id: 0, name: 'A'},
          {id: 1, name: 'B'}
        ]
      }, {
        type: actions.REMOVE_NODE,
        name: 'C'
      })
    ).toEqual({
      nodes: [
        {id: 0, name: 'A'},
        {id: 1, name: 'B'}
      ],
      edges: [],
      start: null,
      end: null
    });
  })
})