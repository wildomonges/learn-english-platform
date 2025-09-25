import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import { fetchTopics } from '../api/topicAPI';
import type { Topic, Interest } from '../types/Topic';

import { useAuth } from '../context/AuthContext';
import PracticeTree from '../components/PracticeTree';
import PracticeChat from '../components/PracticeChat';
import Welcome from '../components/Welcome';
import Topics from '../components/Topics';
import Interests from '../components/Interests';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const HomePage: React.FC = () => {
  const [step, setStep] = useState<
    'welcome' | 'login' | 'register' | 'topics' | 'interests' | 'dialog'
  >('welcome');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(
    null
  );
  const { user } = useAuth();
  const [practiceId, setPracticeId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setStep('topics');
  }, []);

  useEffect(() => {
    if (!user) setStep('welcome');
  }, [user]);

  const loadTopics = async () => {
    try {
      const data = await fetchTopics();
      setTopics(data);
    } catch (error) {
      console.error('Error cargando los temas:', error);
    }
  };
  useEffect(() => {
    loadTopics();
  }, []);

  const handleStart = () => {
    if (user) setStep('topics');
    else setStep('login');
  };

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
      {step === 'topics' || step === 'interests' || step === 'dialog' ? (
        <div style={{ display: 'flex' }}>
          {/* Sidebar izquierdo */}
          {step !== 'dialog' && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <PracticeTree />
            </div>
          )}

          {step === 'topics' && (
            <Topics
              topics={topics}
              onSelect={handleTopicSelect}
              onBack={handleBack}
            />
          )}

          {step === 'interests' && selectedTopic && (
            <Interests
              topic={selectedTopic}
              onSelect={handleInterestSelect}
              onBack={handleBack}
            />
          )}

          {step === 'dialog' && selectedTopic && selectedInterest && (
            <div className='container'>
              <PracticeChat
                topic={selectedTopic.name}
                interest={selectedInterest.name}
                existingDialogs={[]}
                onBack={handleBack}
                practiceId={practiceId ?? 0}
              />
            </div>
          )}
        </div>
      ) : step === 'login' ? (
        <LoginPage
          onSuccess={() => setStep('topics')}
          onSwitchToRegister={() => setStep('register')}
        />
      ) : step === 'register' ? (
        <RegisterPage
          onSuccess={() => setStep('login')}
          onSwitchToLogin={() => setStep('login')}
        />
      ) : (
        <Welcome
          onStart={handleStart}
          onLogin={() => setStep('login')}
          onRegister={() => setStep('register')}
          user={user}
        />
      )}
    </div>
  );
};

export default HomePage;
