import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
    domain="dev-66pmyomjo1o8az2g.us.auth0.com"
    clientId="epfuyeJvdgxdXPK6dVPl1BoAUydMv0q7"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <Router>
    <App />
    </Router>
    </Auth0Provider>
 
  </StrictMode>,
)
