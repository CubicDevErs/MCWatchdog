import React from 'react';
import { createRoot } from 'react-dom/client';
import './App';
import App from './App';
import { registerServiceWorker } from './ServiceWorkerRegistration';

registerServiceWorker();

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);