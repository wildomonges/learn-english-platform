import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
// Si usas create-react-app usa process.env.REACT_APP_RECAPTCHA_SITE_KEY

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleReCaptchaProvider>
  </StrictMode>
);
