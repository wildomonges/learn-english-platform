import React from 'react';
import '../styles/TopicCard.css';

type TopicCardProps = {
  name: string;
  imgUrl: string;
  onClick: () => void;
};

const TopicCard: React.FC<TopicCardProps> = ({ name, imgUrl, onClick }) => {
  return (
    <button className='topic-card' onClick={onClick}>
      <img src={imgUrl} alt={name} className='topic-image' />
      <span className='topic-name'>{name}</span>
    </button>
  );
};

export default TopicCard;
