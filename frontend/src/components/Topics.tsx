import React from 'react';
import { Container } from '@mui/material';
import type { Topic } from '../types/Topic';
import '../styles/TopicsAndInterests.css';

interface TopicsProps {
  topics: Topic[];
  onSelect: (topic: Topic) => void;
  onBack: () => void;
}

const Topics: React.FC<TopicsProps> = ({ topics, onSelect, onBack }) => {
  return (
    <Container maxWidth='sm' className='cards-container'>
      <div className='cards-inner'>
        <h2 className='subtitle'>¿Qué te interesa aprender?</h2>

        <div className='cards-grid'>
          {topics.map((topic: Topic) => (
            <div
              key={topic.id}
              className='card'
              onClick={() => onSelect(topic)}
            >
              <img src={topic.imgUrl} alt={topic.name} />
              <span>{topic.name}</span>
            </div>
          ))}
        </div>

        <button className='button-back' onClick={onBack}>
          ◀ Volver
        </button>
      </div>
    </Container>
  );
};

export default Topics;
