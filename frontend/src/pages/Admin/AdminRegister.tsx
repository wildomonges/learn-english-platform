import React, { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Link } from 'react-router-dom';
import '../../styles/AdminRegister.css';

const AdminRegister: React.FC = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [firstName, setFirstName] = useState('Admin');
  const [lastName, setLastName] = useState('User');
  const [email, setEmail] = useState('admin@learn.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      setError('reCAPTCHA no listo.');
      return;
    }

    const captchaToken = await executeRecaptcha('signup');

    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/sign_up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          captchaToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error registrando admin');

      setSuccess('Administrador creado correctamente 🎉');
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className='admin-register-container'>
      <div className='admin-register-card'>
        <h2>Registrar Administrador</h2>

        {error && <p className='error-message'>{error}</p>}
        {success && <p className='success-message'>{success}</p>}

        <form onSubmit={handleRegister}>
          <div className='register-input-group'>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder='Nombre'
            />
          </div>

          <div className='register-input-group'>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder='Apellido'
            />
          </div>

          <div className='register-input-group'>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Correo electrónico'
            />
          </div>

          <div className='register-input-group'>
            <input
              value={password}
              type='password'
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Contraseña'
            />
          </div>

          <button type='submit' className='register-button'>
            Crear Administrador
          </button>
        </form>

        <p className='register-footer'>
          ¿Ya tienes cuenta?{' '}
          <Link to='/admin-login' className='register-link'>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
