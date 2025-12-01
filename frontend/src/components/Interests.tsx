import React from 'react';
import type { Topic, Interest } from '../types/Topic';
import '../styles/TopicsAndInterests.css';

interface InterestsProps {
  topic: Topic;
  onSelect: (interest: Interest) => void;
  onBack: () => void;
}

const Interests: React.FC<InterestsProps> = ({ topic, onSelect, onBack }) => {
  return (
    <div className='cards-wrapper'>
      <div className='cards-container'>
        <h2 className='subtitle'>¿Qué área de "{topic.name}" te interesa?</h2>

        <div className='cards-grid'>
          {topic.interests.map((interest) => (
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
      </div>
    </div>
  );
};

export default Interests;
