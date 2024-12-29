import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const ToggleButton = ({ ...restProps }) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  return (
    <button
      onClick={toggleSwitch}
      className={twMerge(
        'relative w-16 h-8 rounded-full transition-colors duration-300',
        isOn ? 'bg-green-500' : 'bg-gray-300'
      )}
      {...restProps}
    >
      <span
        className={twMerge(
          'absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-[0_0_10px]',
          isOn ? 'transform translate-x-8' : ''
        )}
      />
    </button>
  );
};

export default ToggleButton;
