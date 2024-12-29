import React from 'react';
import { cn } from '../../utils/cn';

const RadioInput = ({ label, className, checked, ...restProps }) => {
  return (
    <label className="inline-flex items-center space-x-2 cursor-pointer group">
      <input
        type="radio"
        {...restProps}
        checked={checked} // Ensure this radio input reflects its checked state
        className={cn(
          'appearance-none h-3 w-3 border border-gray-300 rounded-full transition',
          'checked:bg-primary checked:border-primary ',
          'checked:ring-1 checked:ring-primary checked:ring-offset-2', // Ring for checked state
          ' duration-150 ease-in-out',
          'hover:border hover:border-primary cursor-pointer',
          className
        )}
      />
      {/* Conditionally apply text-primary when checked */}
      <span
        className={cn(
          checked ? 'font-medium opacity-90' : ' group-hover:text-primary '
        )}
      >
        {label}
      </span>
    </label>
  );
};

export default RadioInput;
