import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { seedDatabase } from './api/seed';

async function main() {
  // Start the mocking conditionally.
  if (process.env.NODE_ENV === 'development') {
    const { worker } = require('./api/server');
    await worker.start();
  }

  // Seed the database
  await seedDatabase();

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

main();