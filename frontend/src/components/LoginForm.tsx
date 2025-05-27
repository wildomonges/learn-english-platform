import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simula login exitoso (luego reemplazarás con fetch)
    if (email && password) {
      localStorage.setItem('token', 'fake-token');
      navigate('/');
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  return (
    <div className='login-container'>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type='email'
          placeholder='Correo electrónico'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit'>Iniciar</button>
      </form>
    </div>
  );
};

export default LoginForm;
