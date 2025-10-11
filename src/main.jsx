// ... imports
import AppWrapper from './App.jsx' // Change this import
import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css' // Import the new global stylesheet

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper /> {/* Change this component */}
  </React.StrictMode>,
)
