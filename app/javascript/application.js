// Entry point for the build script in your package.json
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';

import "@hotwired/turbo-rails";
import "./controllers";

document.addEventListener('turbo:load', () => {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement);

  root.render(<App />);
});