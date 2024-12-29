import React from 'react';
import { cn } from '../utils/cn';

const Tooltip = ({ children, content = ' ', position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-3',
  };

  const arrowClasses = {
    top: 'left-1/2 transform -translate-x-1/2 -bottom-1.5 border-t-8 border-t-gray-800 border-l-8 border-r-8 border-l-transparent border-r-transparent dark:border-t-gray-900',
    bottom:
      'left-1/2 transform -translate-x-1/2 -top-1.5 border-b-8 border-b-gray-800 border-l-8 border-r-8 border-l-transparent border-r-transparent  dark:border-b-gray-900',
    left: 'top-1/2 transform -translate-y-1/2 -right-1.5 border-l-8 border-l-gray-800 border-t-8 border-b-8 border-t-transparent border-b-transparent  dark:border-l-gray-900',
    right:
      'top-1/2 transform -translate-y-1/2 -left-1.5 border-r-8 border-r-gray-800 border-t-8 border-b-8 border-t-transparent border-b-transparent  dark:border-r-gray-900',
  };

  return (
    <div className="relative z-10 flex items-center group">
      {children}
      <div
        className={cn(
          'absolute  hidden w-32 p-2 text-sm text-white bg-gray-800 dark:bg-gray-900 rounded-md group-hover:block text-center',
          positionClasses[position]
        )}
      >
        {content}
        <div className={cn('absolute w-0 h-0', arrowClasses[position])} />
      </div>
    </div>
  );
};

export default Tooltip;
