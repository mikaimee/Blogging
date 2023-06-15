import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom'
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import {QueryClientProvider, QueryClient, Query} from '@tanstack/react-query'
import store from './store';

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>
);

