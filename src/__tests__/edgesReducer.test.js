import * as actions from '../actions.js';
import dijkstraApp from '../reducers.js';

describe('edges reducer', () => {
  it('should handle ADD_EDGE', () => {
    // add edge to undefined initial state
    expect(
      dijkstraApp(undefined, {
        type: actions.ADD_EDGE,
        id: 0,
        from: 'A',
        to: 'B'
      })
    ).toEqual({
      nodes: [],
      edges: [
        {id: 0, from: 'A', to: 'B', dist: 0}
      ],
      start: null,
      end: null
    });
  });

  it('should handle REMOVE_EDGE', () => {
    expect(
      dijkstraApp({
        nodes: [
          {id: 0, name: 'A'},
          {id: 1, name: 'B'}
        ],
        edges: [
          {id: 0, from: 'A', to: 'B', dist: 0}
        ]
      }, {
        type: actions.REMOVE_EDGE,
        from: 'A',
        to: 'B'
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

  it('should handle REMOVE_EDGE_ALL', () => {
    expect(
      dijkstraApp({
        nodes: [
          {id: 0, name: 'A'},
          {id: 1, name: 'B'},
          {id: 2, name: 'C'},
          {id: 3, name: 'D'}
        ],
        edges: [
          {id: 0, from: 'A', to: 'B', dist: 0},
          {id: 1, from: 'C', to: 'A', dist: 0},
          {id: 2, from: 'A', to: 'D', dist: 0},
          {id: 3, from: 'B', to: 'C', dist: 1}
        ]
      }, {
        type: actions.REMOVE_EDGE_ALL,
        from: 'A'
      })
    ).toEqual({
      nodes: [
        {id: 0, name: 'A'},
        {id: 1, name: 'B'},
        {id: 2, name: 'C'},
        {id: 3, name: 'D'}
      ], 
      edges: [
        {id: 3, from: 'B', to: 'C', dist: 1}
      ],
      start: null,
      end: null
    })
  });

  it('should handle SET_DIST', ()=>{
    expect(
      dijkstraApp({
        nodes: [
          {id: 0, name: 'A'},
          {id: 1, name: 'B'}
        ],
        edges: [
          {id: 0, from: 'A', to: 'B', dist: 0}
        ],
        start: 'A',
        end: 'B' 
      }, {
        type: actions.SET_DIST,
        from: 'A',
        to: 'B',
        dist: 9
      })
    ).toEqual({
      nodes: [
        {id: 0, name: 'A'},
        {id: 1, name: 'B'}
      ],
      edges: [
        {id: 0, from: 'A', to: 'B', dist: 9}
      ],
      start: 'A',
      end: 'B'
    })
  })
});