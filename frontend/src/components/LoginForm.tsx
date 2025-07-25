import React, { useState } from 'react';
import '../styles/LoginForm.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<Props> = ({ onSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('El correo no es válido.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 6 || password.length > 20) {
      setPasswordError('La contraseña debe tener entre 6 y 20 caracteres.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/auth/sign_in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('Respuesta del backend:', data);

      if (!res.ok || !data.access_token || !data.user) {
        alert(data.message || 'No se pudo iniciar sesión.');
        return;
      }

      // The context login is used
      login(data.user, data.access_token);

      onSuccess?.();
      navigate('/');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      alert('Error al iniciar sesión. Verifica tus datos o intenta más tarde.');
    }
  };

  return (
    <div className='login-container'>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} noValidate>
        <input
          type='email'
          placeholder='Correo electrónico'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <span className='error-text'>{emailError}</span>}

        <input
          type='password'
          placeholder='Contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {passwordError && <span className='error-text'>{passwordError}</span>}

        <button type='submit'>Iniciar</button>
      </form>
      <p>¿No tienes una cuenta?</p>
      <button onClick={onSwitchToRegister}>Crear cuenta</button>
    </div>
  );
};

export default LoginForm;
