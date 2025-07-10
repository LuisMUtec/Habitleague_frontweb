import React from 'react';
import type { InputProps } from '../../types';

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'block w-full px-3 py-2 border border-[#CEC1A8] rounded-md shadow-sm placeholder-[#AAA396] focus:outline-none focus:ring-2 focus:ring-[#B59E7D] focus:border-[#B59E7D] disabled:bg-[#F1EADA] disabled:text-[#AAA396] disabled:cursor-not-allowed';
  const errorClasses = error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '';
  const classes = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={classes}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input; 