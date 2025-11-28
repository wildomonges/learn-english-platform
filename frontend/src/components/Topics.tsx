import React from 'react';

import type { Topic } from '../types/Topic';
import '../styles/TopicsAndInterests.css';

interface TopicsProps {
  topics: Topic[];
  onSelect: (topic: Topic) => void;
  onBack: () => void;
}

const Topics: React.FC<TopicsProps> = ({ topics, onSelect, onBack }) => {
  return (
    <div className='cards-wrapper'>
      <div className='cards-container'>
        <h2 className='subtitle'>¿Qué te interesa aprender?</h2>

        <div className='cards-grid'>
          {topics.map((topic) => (
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
    </div>
  );
};
export default Topics;
