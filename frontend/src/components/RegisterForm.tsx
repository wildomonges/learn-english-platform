import React, { useState } from 'react';
import '../styles/RegisterFrom.css';

interface Props {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<Props> = ({ onSuccess, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/auth/sign_up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'student' }),
      });

      if (!res.ok) throw new Error('Error al registrar');
      setMessage('Registro exitoso, inicia sesión');
      onSuccess?.();
    } catch (err) {
      setMessage('Error al registrarse');
    }
  };

  return (
    <div className='admin-login-container'>
      <form className='admin-login-form' onSubmit={handleSubmit}>
        <h2>Crear cuenta</h2>
        <p>Completa tus datos para registrarte</p>

        <div className='input-group'>
          <input
            name='firstName'
            placeholder='Nombre'
            onChange={handleChange}
            required
          />
        </div>

        <div className='input-group'>
          <input
            name='lastName'
            placeholder='Apellido'
            onChange={handleChange}
            required
          />
        </div>

        <div className='input-group'>
          <input
            name='email'
            type='email'
            placeholder='Correo electrónico'
            onChange={handleChange}
            required
          />
        </div>

        <div className='input-group'>
          <input
            name='password'
            type='password'
            placeholder='Contraseña'
            onChange={handleChange}
            required
          />
        </div>

        <button type='submit' className='login-button'>
          Crear cuenta
        </button>

        <button type='button' className='switch-auth' onClick={onSwitchToLogin}>
          ¿Ya tienes cuenta? Inicia sesión
        </button>
        {message && <p className='form-message'>{message}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;
