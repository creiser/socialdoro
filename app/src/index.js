import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import App from './App';
import './index.css';

const store = configureStore();


ReactDOM.render(
    <Provider store={store}>
        <App dispatch={store.dispatch}/>
    </Provider>,
    document.getElementById('root')
);
