import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LogIn from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

ReactDOM.render(
                <Provider store={ createStore(reducers, applyMiddleware(thunk)) }>
                    <LogIn />
                </Provider>
                , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
