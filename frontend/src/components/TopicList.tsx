import React from 'react';
import { Topic } from '../types/Topic';
import '../styles/TopicList.css';

interface TopicListProps {
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
}

const TopicList: React.FC<TopicListProps> = ({ topics, onSelectTopic }) => {
  return (
    <div className='list-container'>
      {topics.map((topic: Topic) => (
        <div
          className='topic-card'
          key={topic.id}
          onClick={() => onSelectTopic(topic)}
        >
          <div className='topic-content'>
            <h2>{topic.name}</h2>
            <p>{topic.description}</p>
          </div>
          <span className='topic-arrow'>➡️</span>
        </div>
      ))}
    </div>
  );
};

export default TopicList;
