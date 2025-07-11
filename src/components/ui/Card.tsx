import React from 'react';
import type { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  ...props
}) => {
  const baseClasses = 'bg-[#F7F4F2] rounded-lg shadow-sm border border-[#CEC1A8] overflow-hidden';
  const hoverClasses = hoverable ? 'hover:shadow-md hover:border-[#B59E7D] transition-all duration-200 cursor-pointer' : '';
  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  return (
    <div
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 