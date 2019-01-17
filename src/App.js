import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import dijkstraApp from './reducers';

import logo from './logo.svg';
import './App.css';

import ConnectedCanvas from './Canvas';
import ConnectedRunner from './Runner';
import ConnectedChart from './Chart';

const store = createStore(dijkstraApp, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

class App extends Component {

  render() {
    return (
      <div>
        <Provider store={store}>
          <ConnectedCanvas />       
          <ConnectedRunner />
          <ConnectedChart />
        </Provider>
      </div>
    );
  }

}

export default App;
