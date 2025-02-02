import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter as Router} from "react-router";
import App from './App.jsx'
import './index.css';
import {UserContext} from './context/UserContext.js';
import UserContextProvider from './components/UserContextProvider.jsx';
import AlertContextProvider from './components/AlertContextProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <AlertContextProvider>
        <Router>
          <App />
        </Router>
      </AlertContextProvider>
    </UserContextProvider>
  </StrictMode>,
)
