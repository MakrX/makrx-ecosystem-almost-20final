import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';
import '../global.css';
import { initKeycloak } from '../lib/auth';

async function bootstrap() {
  await initKeycloak();
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>,
  );
}

bootstrap();
