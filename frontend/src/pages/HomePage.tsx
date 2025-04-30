import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import TopicList from '../components/TopicList';
import TopicDetail from '../components/TopicDetail';
import { Topic } from '../types/Topic';
import '../styles/HomePage.css';
import illustration from '../assets/english-illustration.png';

const topics: Topic[] = [
  {
    id: 1,
    name: 'English for Developer',
    description: 'Learn English for software development.',
    translation: 'Inglés para desarrollo de software',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    interests: ['React', 'Node.js'],
  },
  {
    id: 2,
    name: 'English for Marketing',
    description: 'Master English in digital marketing.',
    translation: 'Inglés para marketing digital',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    interests: ['SEO', 'Email Marketing'],
  },
];

const HomePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='homepage'>
      <Navbar />
      <header className='header'>
        <div className='header-content'>
          <h1>Bienvenido a la Plataforma en Inglés</h1>
          {!selectedTopic && (
            <input
              type='text'
              placeholder='Buscar topicos...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
        </div>
        {!selectedTopic && (
          <img src={illustration} alt='English illustration' />
        )}
      </header>

      <main>
        {selectedTopic ? (
          <TopicDetail
            topic={selectedTopic}
            onBack={() => setSelectedTopic(null)}
          />
        ) : (
          <TopicList topics={filteredTopics} onSelectTopic={setSelectedTopic} />
        )}
      </main>
    </div>
  );
};

export default HomePage;
