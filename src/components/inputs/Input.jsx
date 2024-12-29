import React from 'react';
import { cn } from '../../utils/cn';

const Input = ({ className, label, icon, error, ...restProps }) => {
  return (
    <label htmlFor="" className="relative block w-full">
      {label && (
        <span className="block mb-1 font-medium capitalize ">{label}</span>
      )}
      <div className="w-full relative">
        <input
          className={cn(
            ' px-3 h-10 w-full focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed  dark:bg-gray-800 rounded-lg border appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
            className
          )}
          {...restProps}
        />
        {icon && <span className="absolute right-3 top-2.5">{icon}</span>}
      </div>
      {error && (
        <span className="mt-1 text-sm text-red-500 italic">{error}</span>
      )}
    </label>
  );
};

export default Input;
