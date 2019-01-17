// action types

export const ADD_NODE = 'ADD_NODE';
export const REMOVE_NODE = 'REMOVE_NODE';
export const ADD_EDGE = 'ADD_EDGE';
export const REMOVE_EDGE = 'REMOVE_EDGE';
export const REMOVE_EDGE_ALL = 'REMOVE_EDGE_ALL';
export const SET_START = 'SET_START';
export const SET_END = 'SET_END';
export const SET_DIST = 'SET_DIST';
export const UPDATE_STATUS = 'UPDATE_STATUS';

// action creators

let nextNodeId = 0;
let nextEdgeId = 0;

export function addNode(name) {
  return {
    type: ADD_NODE,
    id: nextNodeId++,
    name
  }
}

export function removeNode(name) {
  return {
    type: REMOVE_NODE,
    name
  }
}

export function addEdge(from, to, dist) {
  return {
    type: ADD_EDGE,
    id: nextEdgeId++,
    from, 
    to,
    dist
  }
}

export function removeEdge(from, to) {
  return {
    type: REMOVE_EDGE,
    from,
    to    
  }
}

export function removeEdgeAll(from) {
  return {
    type: REMOVE_EDGE_ALL,
    from
  }
}

export function setStart(name) {
  return {
    type: SET_START,
    name
  }
}

export function setEnd(name) {
  return {
    type: SET_END,
    name
  }
}

export function setDist(from, to, dist) {
  return {
    type: SET_DIST,
    from,
    to,
    dist
  }
}

export function updateStatus(status) {
  return {
    type: UPDATE_STATUS,
    status
  }
}