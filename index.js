/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import reducers from './src/reducers'
import thunk from "redux-thunk";

const store = createStore(reducers, applyMiddleware(thunk))
const Providers = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    )

}
AppRegistry.registerComponent(appName, () => Providers);
