import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminLogin.css';
import ReCAPTCHA from 'react-google-recaptcha';

interface Props {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<Props> = ({ onSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  const [captchaToken, setCaptchaToken] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let valid = true;
    if (!validateEmail(email)) {
      setEmailError('Correo no válido.');
      valid = false;
    } else setEmailError('');

    if (password.length < 6 || password.length > 20) {
      setPasswordError('Contraseña debe tener 6-20 caracteres.');
      valid = false;
    } else setPasswordError('');

    if (!valid) return;

    if (!captchaToken) {
      setError('Por favor marca el reCAPTCHA.');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/auth/sign_in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken }),
      });

      const data = await res.json();

      if (!res.ok || !data.access_token || !data.user) {
        setError(data.message || 'No se pudo iniciar sesión.');
        return;
      }

      login(data.user, data.access_token);
      onSuccess?.();
      navigate('/');
    } catch (err) {
      setError('Error al iniciar sesión. Intenta más tarde.');
      console.error(err);
    }
  };

  return (
    <div className='admin-login-container'>
      <form className='admin-login-form' onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        <p>Ingresa tus credenciales para acceder a tu cuenta.</p>

        {error && <div className='error-message'>{error}</div>}

        <div className='input-group'>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Correo electrónico'
            required
          />
          <FaUser className='input-icon' />
        </div>
        {emailError && <span className='error-message'>{emailError}</span>}

        {/* Password */}
        <div className='input-group'>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Contraseña'
            required
          />
          <FaLock className='input-icon' />
        </div>
        {passwordError && (
          <span className='error-message'>{passwordError}</span>
        )}

        <button type='submit' className='login-button'>
          Iniciar
        </button>
        <div className='recaptcha-wrapper'>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token: string | null) => setCaptchaToken(token ?? '')}
          />
        </div>
        {onSwitchToRegister && (
          <button
            type='button'
            className='switch-auth'
            onClick={onSwitchToRegister}
          >
            Crear cuenta
          </button>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
