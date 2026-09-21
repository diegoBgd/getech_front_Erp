import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { NetworkOverlay } from './components/ui/NetworkOverlay.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <NetworkOverlay/>
    <App />
  </StrictMode>,
);
