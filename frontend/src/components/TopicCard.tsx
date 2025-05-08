import React from 'react';
import { Topic } from '../types/Topic';
import { ArrowRight } from 'lucide-react';
import '../styles/TopicCard.css';

interface Props {
  topic: Topic;
  onSelect: (topic: Topic) => void;
}

const TopicCard: React.FC<Props> = ({ topic, onSelect }) => {
  return (
    <div className='topic-card' onClick={() => onSelect(topic)}>
      <div
        className='card-background'
        style={{
          backgroundImage: `url(${topic.imageUrl})`,
        }}
      >
        <div className='card-overlay'>
          <h3>{topic.name}</h3>
          <p>{topic.description}</p>
          <span className='see-more'>
            Ver más <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
