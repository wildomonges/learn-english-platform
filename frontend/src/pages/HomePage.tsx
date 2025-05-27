import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import welcomeImage from '../assets/image1.png';
import PracticeChat from '../components/PracticeChat';
import { fetchTopics } from '../api/topicAPI';
import type { Topic, Interest } from '../types/Topic';

const HomePage: React.FC = () => {
  const [step, setStep] = useState<
    'welcome' | 'topics' | 'interests' | 'dialog'
  >('welcome');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(
    null
  );

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const data = await fetchTopics();
        setTopics(data);
      } catch (error) {
        console.error('Error cargando los temas:', error);
      }
    };

    loadTopics();
  }, []);

  const handleStart = () => setStep('topics');
  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setStep('interests');
  };
  const handleInterestSelect = (interest: Interest) => {
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
            {topics.map((topic) => (
              <button key={topic.id} onClick={() => handleTopicSelect(topic)}>
                {topic.name}
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
            ¿Qué área de "{selectedTopic.name}" te interesa?
          </h2>
          <div className='button-group'>
            {selectedTopic.interests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => handleInterestSelect(interest)}
              >
                <img
                  src={interest.imgUrl}
                  alt={interest.name}
                  style={{ width: '40px', height: '40px', marginRight: '8px' }}
                />
                {interest.name}
              </button>
            ))}
          </div>
          <button className='button-back' onClick={handleBack}>
            ◀ Volver
          </button>
        </div>
      )}

      {step === 'dialog' && selectedTopic && selectedInterest && (
        <div className='container'>
          <PracticeChat
            topic={selectedTopic.name}
            interest={selectedInterest.name}
            onBack={handleBack}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
