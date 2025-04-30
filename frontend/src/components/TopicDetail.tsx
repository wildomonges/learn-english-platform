import React from 'react';
import { Topic } from '../types/Topic';
import '../styles/TopicDetail.css';

interface TopicDetailProps {
  topic: Topic;
  onBack: () => void;
}

const TopicDetail: React.FC<TopicDetailProps> = ({ topic, onBack }) => {
  return (
    <div className='detail-container'>
      <button className='back-button' onClick={onBack}>
        ← Volver
      </button>

      <div className='detail-card'>
        <h2 className='topic-title'>{topic.name}</h2>

        <p className='description'>
          <strong>📘 Español:</strong> {topic.description}
        </p>
        <p className='description'>
          <strong>🌐 Inglés:</strong> {topic.translation}
        </p>

        {topic.audioUrl && (
          <audio className='audio-player' controls src={topic.audioUrl}>
            Tu navegador no soporta el audio.
          </audio>
        )}

        <h3>💡 Temas de interés</h3>
        <ul className='interests-container'>
          {topic.interests.map((interest, index) => (
            <li className='interest-item' key={index}>
              {interest}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopicDetail;
