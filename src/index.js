import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { seedDatabase } from './api/seed'; 
const { worker } = require('./api/server');

async function main() {
  
  await worker.start({
    onUnhandledRequest: 'bypass',
  });

  await seedDatabase();

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

main();