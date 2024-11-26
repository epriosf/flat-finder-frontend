import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'; // Icons
import 'primereact/resources/primereact.min.css'; // Core Styles
import 'primereact/resources/themes/md-light-indigo/theme.css'; //Theme
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/authContext.tsx';
TimeAgo.addDefaultLocale(en);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
