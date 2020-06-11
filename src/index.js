import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import { BrowserRouter } from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router'

import todoApp from './reducers'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { history } from "./history";
import configureStore from "./configureStore";

// const store = createStore(todoApp)
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
        <App/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
