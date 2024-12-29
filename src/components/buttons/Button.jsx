import React from 'react';
import { cn } from '../../utils/cn';
import LoadingCircle from '../svgs/LoadingCircle';

const Button = ({
  children,
  className,
  variant = 'primary',
  loading,
  ...restProps
}) => {
  const baseStyles = `active:scale-95 flex items-center justify-center gap-2 px-4 py-3 max-h-10 font-semibold text-sm rounded-md focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-30 dark:disabled:opacity-20  disabled:cursor-not-allowed disabled:active:scale-100`;

  const variantStyles = {
    primary: `bg-primary text-white hover:bg-primaryDark dark:bg-primary dark:hover:bg-primaryDark disabled:bg-primary dark:disabled:bg-primary`,
    secondary: `bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:bg-gray-800 dark:disabled:bg-gray-700`,
    danger: `bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 disabled:bg-red-500 dark:disabled:bg-red-500`,
    success: `bg-green-500 text-white hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-600 disabled:bg-green-500 dark:disabled:bg-green-500`,
    info: `bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-blue-500 dark:disabled:bg-blue-500`,
    light: `bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 
        disabled:bg-gray-300 disabled:text-gray-500 disabled:dark:bg-gray-700 
        disabled:pointer-events-none disabled:cursor-not-allowed`,

    dark: `bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-900 disabled:bg-gray-800 dark:disabled:bg-gray-800`,
    outline: `border border-primary text-primary hover:bg-primaryDark hover:text-white dark:border-primary dark:text-primary dark:hover:bg-primaryDark dark:hover:text-white dark:hover:border-primaryDark disabled:hover:bg-transparent  dark:disabled:hover:bg-transparent  disabled:border-primary disabled:text-primary dark:disabled:border-primary dark:disabled:text-primary`,
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      disabled={loading}
      {...restProps}
    >
      {loading ? <LoadingCircle /> : children}
    </button>
  );
};

export default Button;
