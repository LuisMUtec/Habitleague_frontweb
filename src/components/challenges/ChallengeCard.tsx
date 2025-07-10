import React from 'react';

interface ChallengeCardProps {
  title: string;
  cover: string;
  className?: string;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ title, cover, className }) => {
  return (
    <div className={className}>
      <img src={cover} alt={title} className="w-full h-full object-cover rounded-xl" />
      <h3 className="mt-2 text-sm text-center">{title}</h3>
    </div>
  );
};

export default ChallengeCard; 