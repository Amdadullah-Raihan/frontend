import React from 'react';
import Text from '../texts/Text';

const SelectInput = ({
  label,
  options = [],
  value,
  error,
  onChange,

  placeholder = 'Select an option',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="mb-2 font-medium">{label}</label>}
      <select
        className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 ${error && 'border-red-500 dark:border-red-500'}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <Text className="text-sm text-red-500 italic">{error}</Text>}
    </div>
  );
};

export default SelectInput;
