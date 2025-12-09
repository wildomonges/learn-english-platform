import React, { useState } from 'react';
import '../styles/RegisterFrom.css';
import ReCAPTCHA from 'react-google-recaptcha';

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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!captchaToken) {
      setMessage('Por favor, completa el captcha');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      if (!API_URL) throw new Error('La URL de la API no está definida');

      console.log('Registrando en:', API_URL);
      console.log('Datos enviados:', form, 'Captcha:', captchaToken);

      const res = await fetch(`${API_URL}/auth/sign_up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'student', captchaToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || `Error ${res.status}: ${res.statusText}`
        );
      }

      console.log('Registro exitoso:', data);
      setMessage('Registro exitoso, inicia sesión');
      onSuccess?.();
    } catch (err) {
      console.error('Error al registrar:', err);
      setMessage(
        'Error al registrarse: ' +
          (err instanceof Error ? err.message : String(err))
      );
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
        <div className='recaptcha-wrapper'>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
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
