import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import createStore from './store';
import {Provider} from "react-redux";
import {fetchExamples} from "./store/examples";

import relativeTime from 'dayjs/plugin/relativeTime'
import * as dayjs from "dayjs";
dayjs.extend(relativeTime);


const store = createStore();

store.dispatch(fetchExamples());

const rootElement = document.getElementById('root')
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
