import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App.jsx';
import { AppProvider } from './context/AppContext.jsx'; // Import the provider
import './global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider> {/* Wrap the entire app */}
      <AppWrapper />
    </AppProvider>
  </React.StrictMode>,
);