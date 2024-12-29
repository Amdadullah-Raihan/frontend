import React from 'react';
import { cn } from '../../utils/cn';

const Textarea = ({ label, className, ...restProps }) => {
  return (
    <>
      {label && <label className="mb-1 block font-medium">{label}</label>}
      <textarea
        className={cn(
          ' w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary outline-offset-0 dark:bg-gray-800',
          className
        )}
        {...restProps}
      />
    </>
  );
};

export default Textarea;
