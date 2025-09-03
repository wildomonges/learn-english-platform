import React from 'react';
import type { Topic } from '../types/Topic';
import TopicCard from './TopicCard';

interface TopicsProps {
  topics: Topic[];
  onSelect: (topic: Topic) => void;
  onBack: () => void;
}

const Topics: React.FC<TopicsProps> = ({ topics, onSelect, onBack }) => {
  return (
    <div className='container'>
      <h2 className='subtitle'>¿Qué te interesa aprender?</h2>
      <div className='button-group'>
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            name={topic.name}
            imgUrl={topic.imgUrl}
            onClick={() => onSelect(topic)}
          />
        ))}
      </div>
      <button className='button-back' onClick={onBack}>
        ◀ Volver
      </button>
    </div>
  );
};

export default Topics;
