import React, { useState } from 'react';
import '../styles/HomePage.css';
import learnIllustration from '../assets/learn-english.png';

const HomePage: React.FC = () => {
  const [step, setStep] = useState<
    'start' | 'language' | 'level' | 'goal' | 'motivation' | 'complete'
  >('start');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [motivation, setMotivation] = useState('');
  const [style, setStyle] = useState('');

  const handleReset = () => {
    setStep('start');
    setLanguage('');
    setLevel('');
    setGoal('');
    setMotivation('');
    setStyle('');
  };

  return (
    <div className='homepage-onboarding'>
      {step === 'start' && (
        <section className='start-section'>
          <div className='text-content'>
            <h1>¡Bienvenido!</h1>
            <p>
              Descubre el inglés a tu manera. Aprende según tus intereses y
              objetivos. 🌟
            </p>
            <button onClick={() => setStep('language')} className='btn-start'>
              Empezar
            </button>
          </div>
          <div className='image-content'>
            <img src={learnIllustration} alt='Learn English' />
          </div>
        </section>
      )}

      {step === 'language' && (
        <div className='step-section'>
          <h2>Elige tu idioma</h2>
          <div className='options'>
            <button
              onClick={() => {
                setLanguage('english');
                setStep('level');
              }}
            >
              Inglés
            </button>
            <button
              onClick={() => {
                setLanguage('spanish');
                setStep('level');
              }}
            >
              Español
            </button>
          </div>
        </div>
      )}

      {step === 'level' && (
        <div className='step-section'>
          <h2>¿Cuál es tu nivel de inglés?</h2>
          <div className='options'>
            <button
              onClick={() => {
                setLevel('beginner');
                setStep('goal');
              }}
            >
              Principiante
            </button>
            <button
              onClick={() => {
                setLevel('intermediate');
                setStep('goal');
              }}
            >
              Intermedio
            </button>
            <button
              onClick={() => {
                setLevel('advanced');
                setStep('goal');
              }}
            >
              Avanzado
            </button>
          </div>
        </div>
      )}

      {step === 'goal' && (
        <div className='step-section'>
          <h2>¿Qué quieres conseguir?</h2>
          <div className='options'>
            <button
              onClick={() => {
                setGoal('job');
                setStep('motivation');
              }}
            >
              Conseguir un mejor empleo
            </button>
            <button
              onClick={() => {
                setGoal('fluency');
                setStep('motivation');
              }}
            >
              Hablar fluidamente
            </button>
          </div>
        </div>
      )}

      {step === 'motivation' && (
        <div className='step-section'>
          <h2>¡Genial! ¡Vamos a empezar!</h2>
          <button onClick={() => setStep('complete')} className='btn-primary'>
            Continuar
          </button>
        </div>
      )}

      {step === 'complete' && (
        <div className='step-section'>
          <h2>¿Cuál es tu motivo principal para aprender inglés?</h2>
          <div className='options'>
            <button onClick={() => setMotivation('conversation')}>
              Conversaciones
            </button>
            <button onClick={() => setMotivation('reading')}>Leer mejor</button>
            <button onClick={() => setMotivation('none')}>
              Sin estilo específico
            </button>
            <button onClick={() => setMotivation('academic')}>
              Academia e investigación
            </button>
            <button onClick={() => setMotivation('university')}>
              Universidad y educación
            </button>
            <button onClick={() => setMotivation('travel')}>
              Viajes y Turismo
            </button>
            <button onClick={() => setMotivation('career')}>
              Empleo y carrera
            </button>
            <button onClick={() => setMotivation('immigration')}>
              Inmigración
            </button>
            <button onClick={() => setMotivation('friends')}>Amigos</button>
            <button onClick={() => setMotivation('certificates')}>
              Certificados
            </button>
            <button onClick={() => setMotivation('other')}>Otros</button>
          </div>
          <div className='navigation'>
            <button onClick={() => setStep('goal')} className='btn-secondary'>
              Atrás
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
