import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    // Validatión email
    if (!validateEmail(email)) {
      setEmailError('El correo no es válido.');
      valid = false;
    } else {
      setEmailError('');
    }

    // Validation password
    if (password.length < 6 || password.length > 20) {
      setPasswordError('La contraseña debe tener entre 6 y 20 caracteres.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      localStorage.setItem('token', 'fake-token');
      navigate('/');
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
    </div>
  );
};

export default LoginForm;
