import React from 'react';
import '../styles/ProgressBar.css';

type Props = {
  current: number;
  total: number;
};

const ProgressBar: React.FC<Props> = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;

  const getEmoji = () => {
    if (percentage === 100) return '🎉';
    if (percentage > 66) return '👏';
    if (percentage > 33) return '⏳';
    return '🚀';
  };

  return (
    <div className='progress-container'>
      <div className='progress-text'>
        {getEmoji()} {current + 1} / {total} preguntas completadas
      </div>
      <div className='progress-bar'>
        <div className='progress-fill' style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
