import React from 'react';
import { Topic } from '../types/Topic';
import TopicCard from './TopicCard';
import '../styles/TopicList.css';

interface TopicListProps {
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
}

const TopicList: React.FC<TopicListProps> = ({ topics, onSelectTopic }) => {
  return (
    <div className='list-container'>
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} onSelect={onSelectTopic} />
      ))}
    </div>
  );
};

export default TopicList;
