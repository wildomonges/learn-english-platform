import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import '../../styles/AdminLogin.css';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const adminEmail = 'admin@learn.com';
    const adminPassword = 'admin123';

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('admin', JSON.stringify({ email }));
      navigate('/admin');
    } else {
      setError('Credenciales incorrectas. Intenta nuevamente.');
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
          <FaUser className='input-icon' />
        </div>

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

        <button type='submit' className='login-button'>
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
