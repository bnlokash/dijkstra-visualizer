import { combineReducers } from 'redux';
import { ADD_NODE, REMOVE_NODE, ADD_EDGE, REMOVE_EDGE, REMOVE_EDGE_ALL, SET_END, SET_START, SET_DIST, UPDATE_STATUS} from './actions.js';

function nodes(state = [], action) {
  switch (action.type) {
    case ADD_NODE:
      return [ 
        ...state,
        {
          id: action.id,
          name: action.name
        }
      ];
    case REMOVE_NODE:
      return state.filter(node => node.name !== action.name);
    default:
      return state;
  }
}

function edges(state = [], action) {
  switch (action.type) {
    case ADD_EDGE:
      return [
        ...state,
        {
          id: action.id,
          from: action.from,
          to: action.to,
          dist: action.dist
        }
      ];

    case REMOVE_EDGE:
      return state.filter(edge => {
        return ( (edge.from !== action.from) && (edge.to !== action.to) );
      });
    case REMOVE_EDGE_ALL:
      return state.filter(edge => {
        if (edge.from === action.from || edge.to === action.from) {
          return false;
        } else return true;
      })

    case REMOVE_NODE:
      return state.filter(edge => {
        if (edge.from === action.from || edge.to === action.from) {
          return false;
        } else return true;
      })

    case SET_DIST:
      return state.map(edge => {
        if ((edge.from === action.from && edge.to === action.to) || (edge.to === action.from && edge.from === action.to) ) {
          edge.dist = action.dist;
        }
        return edge;
      });
    default: 
      return state;
  }
}

function start(state = null, action) {
  switch (action.type) {
    case SET_START:
      return action.name;

    case REMOVE_NODE:
      if (action.name === state) {
        return null;
      } else return state;

    default:
      return state;
  }
}

function end(state = null, action) {
  switch(action.type) {
    case SET_END:
      return action.name;

    case REMOVE_NODE:
      if (action.name === state) {
        return null;
      } else return state;
    default: 
      return state;
  }
}

function status(state = {nodes: [], visiting: null}, action) {
  switch(action.type) {
    case UPDATE_STATUS:
      return action.status
    default: 
      return state;
  }
}

const dijkstraApp = combineReducers({
  nodes,
  edges,
  start,
  end,
  status
});

export default dijkstraApp;