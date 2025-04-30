// src/pages/LoginPage.tsx
import React from 'react';
import '../styles/LoginPage.css';

const LoginPage = () => {
  return (
    <div className='login-container'>
      <h2>Iniciar Sesión</h2>
      <form className='login-form'>
        <input type='email' placeholder='Email' required />
        <input type='password' placeholder='Contraseña' required />
        <button type='submit'>Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;
