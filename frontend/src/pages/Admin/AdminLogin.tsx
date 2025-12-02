import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import { useNavigate } from 'react-router-dom';
import '../../styles/AdminLogin.css';
import { Link } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const [captchaToken, setCaptchaToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!captchaToken) {
      setError('Por favor marca el reCAPTCHA.');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/sign_in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          captchaToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
      }

      localStorage.setItem('admin_token', data.access_token);

      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className='admin-login-container'>
      <form className='admin-login-form' onSubmit={handleLogin}>
        <h2>Acceso Administrador</h2>
        <p>Ingresa tus credenciales para acceder al panel de control.</p>

        {error && <div className='error-message'>{error}</div>}

        <div className='input-group'>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Correo electrónico'
            required
          />
        </div>

        <div className='input-group'>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Contraseña'
            required
          />
        </div>

        <button type='submit' className='login-button'>
          Ingresar
        </button>
        {/* reCAPTCHA V2 */}
        <div className='recaptcha-wrapper'>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token: string | null) => setCaptchaToken(token ?? '')}
          />
        </div>

        <Link
          to='/admin-register'
          className='block text-center mt-4 text-blue-600 font-semibold hover:underline'
        >
          Registrar administrador
        </Link>
      </form>
    </div>
  );
};

export default AdminLogin;
