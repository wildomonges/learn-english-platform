import React from 'react';
import type { Topic, Interest } from '../types/Topic';
import '../styles/HomePage.css';

interface InterestsProps {
  topic: Topic;
  onSelect: (interest: Interest) => void;
  onBack: () => void;
}

const Interests: React.FC<InterestsProps> = ({ topic, onSelect, onBack }) => {
  return (
    <div className='container'>
      <h2 className='subtitle'>¿Qué área de "{topic.name}" te interesa?</h2>
      <div className='button-group'>
        {topic.interests.map((interest) => (
          <button key={interest.id} onClick={() => onSelect(interest)}>
            <img
              src={interest.imgUrl} // 👈 ahora sí coincide con tu modelo
              alt={interest.name}
              style={{
                width: '40px',
                height: '40px',
                marginRight: '8px',
              }}
            />
            {interest.name}
          </button>
        ))}
      </div>
      <button className='button-back' onClick={onBack}>
        ◀ Volver
      </button>
    </div>
  );
};

export default Interests;
