import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <AppWrapper />
    </AppProvider>
  </React.StrictMode>,
);