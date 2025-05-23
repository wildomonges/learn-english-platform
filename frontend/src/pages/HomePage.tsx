import React, { useState } from 'react';
import '../styles/HomePage.css';
import welcomeImage from '../assets/image1.png';
import PracticeChat from '../components/PracticeChat';

const topics = {
  Developer: ['React', 'Java', 'HTML', 'Node.js'],
  Marketing: ['SEO', 'Email Marketing'],
};

const HomePage: React.FC = () => {
  const [step, setStep] = useState<
    'welcome' | 'topics' | 'interests' | 'dialog'
  >('welcome');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  const handleStart = () => setStep('topics');

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setStep('interests');
  };

  const handleInterestSelect = (interest: string) => {
    setSelectedInterest(interest);
    setStep('dialog');
  };

  const handleBack = () => {
    if (step === 'dialog') setStep('interests');
    else if (step === 'interests') setStep('topics');
    else setStep('welcome');
  };

  return (
    <div className='homepage'>
      {step === 'welcome' && (
        <section className='welcome-section'>
          <div className='welcome-text'>
            <h1>📚 ¡Bienvenido a tu viaje de inglés profesional!</h1>
            <p>
              Aprende inglés enfocado en programación o marketing digital.
              ¡Hazlo a tu ritmo, con situaciones reales!
            </p>
            <button className='btn-start' onClick={handleStart}>
              🚀 Empezar
            </button>
          </div>
          <img
            src={welcomeImage}
            alt='Estudiar inglés'
            className='welcome-image'
          />
        </section>
      )}
      {step === 'topics' && (
        <div className='container'>
          <h2 className='subtitle'>¿Qué te interesa aprender?</h2>
          <div className='button-group'>
            {Object.keys(topics).map((topic) => (
              <button
                className='button-h2'
                key={topic}
                onClick={() => handleTopicSelect(topic)}
              >
                Inglés para {topic}
              </button>
            ))}
          </div>
          <button className='button-back' onClick={handleBack}>
            ◀ Volver
          </button>
        </div>
      )}
      {step === 'interests' && selectedTopic && (
        <div className='container'>
          <h2 className='subtitle'>
            ¿Qué área de {selectedTopic} te interesa?
          </h2>
          <div className='button-group'>
            {topics[selectedTopic as keyof typeof topics].map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestSelect(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
          <button className='button-back' onClick={handleBack}>
            ◀ Volver
          </button>
        </div>
      )}
      {step === 'dialog' && selectedInterest && selectedTopic && (
        <div className='container'>
          <PracticeChat
            topic={selectedTopic}
            interest={selectedInterest}
            onBack={handleBack}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
