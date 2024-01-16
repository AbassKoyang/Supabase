import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './features/redux/store.js';
import { Provider } from 'react-redux';
import { apiSlice } from './features/api/apiSlice.js';

store.dispatch(apiSlice.endpoints.getAllClients.initiate());
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>,
)
