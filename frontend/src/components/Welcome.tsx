import React from 'react';
import welcomeImage from '../assets/image1.png';
import '../styles/Welcome.css';

interface WelcomeProps {
  onStart: () => void;
  onLogin: () => void;
  onRegister: () => void;
  user: any;
}

const Welcome: React.FC<WelcomeProps> = ({
  onStart,
  onLogin,
  onRegister,
  user,
}) => {
  return (
    <section className='welcome-section'>
      <div className='welcome-text'>
        <h1>📚 ¡Bienvenido a tu viaje de inglés profesional!</h1>
        <p>
          Aprende inglés enfocado en programación o marketing digital. ¡Hazlo a
          tu ritmo, con situaciones reales!
        </p>
        <button className='btn-start' onClick={onStart}>
          🚀 Empezar
        </button>
        {!user && (
          <div style={{ marginTop: '1rem' }}>
            <button className='btn-login' onClick={onLogin}>
              Iniciar sesión
            </button>
            <button className='btn-register' onClick={onRegister}>
              Registrarse
            </button>
          </div>
        )}
      </div>
      <img src={welcomeImage} alt='Estudiar inglés' className='welcome-image' />
    </section>
  );
};

export default Welcome;
