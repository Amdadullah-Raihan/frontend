// src/components/Icon.js
import { cn } from '../utils/cn';
import React from 'react';

const Icon = ({ className, ...resProps }) => {
  return <img className={cn(`w-full h-full`, className)} {...resProps} />;
};

export default Icon;
