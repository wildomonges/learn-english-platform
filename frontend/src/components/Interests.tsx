import React from 'react';
import type { Topic, Interest } from '../types/Topic';
import '../styles/TopicsAndInterests.css';
import { Container } from '@mui/material';

interface InterestsProps {
  topic: Topic;
  onSelect: (interest: Interest) => void;
  onBack: () => void;
}

const Interests: React.FC<InterestsProps> = ({ topic, onSelect, onBack }) => {
  return (
    <Container
      maxWidth='sm'
      className='cards-container'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '90vh',
        padding: '2rem 1rem',
      }}
    >
      <h2 className='subtitle'>¿Qué área de "{topic.name}" te interesa?</h2>

      <div className='cards-grid'>
        {topic.interests.map((interest: Interest) => (
          <div
            key={interest.id}
            className='card'
            onClick={() => onSelect(interest)}
          >
            <img src={interest.imgUrl} alt={interest.name} />
            <span>{interest.name}</span>
          </div>
        ))}
      </div>

      <button className='button-back' onClick={onBack}>
        ◀ Volver
      </button>
    </Container>
  );
};

export default Interests;
