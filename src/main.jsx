// src/main.jsx (or src/index.jsx) - This should be your application's entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter once
import { Provider } from 'react-redux'; // Import Provider once
import { store } from './app/store'; // Import your Redux store once
import App from './App.jsx'; // This will now be your AppContent component
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* Your single Redux Provider */}
      <Router> {/* Your single React Router */}
        <App /> {/* Render your main App component here */}
      </Router>
    </Provider>
  </React.StrictMode>,
);