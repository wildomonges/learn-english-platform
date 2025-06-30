import React, { useState } from 'react';
import '../styles/RegisterFrom.css';

interface Props {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
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
      const res = await fetch('http://localhost:3000/api/v1/auth/sign_up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error al registrar');
      setMessage('Registro exitoso, inicia sesión');
      onSuccess();
    } catch (err) {
      setMessage('Error al registrarse');
    }
  };

  return (
    <div className='auth-container'>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <input
          name='firstName'
          placeholder='Nombre'
          onChange={handleChange}
          required
        />
        <input
          name='lastName'
          placeholder='Apellido'
          onChange={handleChange}
          required
        />
        <input
          name='email'
          type='email'
          placeholder='Correo'
          onChange={handleChange}
          required
        />
        <input
          name='password'
          type='password'
          placeholder='Contraseña'
          onChange={handleChange}
          required
        />
        <button type='submit'>Crear cuenta</button>
      </form>
      <p>{message}</p>
      <button onClick={onSwitchToLogin}>
        ¿Ya tienes cuenta? Inicia sesión
      </button>
    </div>
  );
};

export default RegisterForm;
