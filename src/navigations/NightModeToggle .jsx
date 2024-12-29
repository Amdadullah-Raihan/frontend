import { SunMoon } from 'lucide-react';

import { twMerge } from 'tailwind-merge';
import { useTheme } from '../context/ThemeContext';

const NightModeToggle = () => {
  const { isDarkMode, toggleNightMode } = useTheme();

  return (
    <div
      onClick={toggleNightMode}
      className="flex items-center justify-between py-2 pl-[0.8rem] pr-1  md:pl-[0.35rem] cursor-pointer"
    >
      <span className="flex items-center gap-2 mr-3 text-sm text-gray-800 md:font-medium dark:text-white">
        <SunMoon size={20} />
        Night Mode
      </span>
      <button
        className={twMerge(
          'relative w-10 h-5 rounded-full transition-colors duration-300 shadow-inner ',
          isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
        )}
      >
        <span
          className={twMerge(
            'absolute bg-white shadow-[0_0_1px_black]  rounded-full transition-transform duration-300 w-4 h-4 top-[0.15rem] left-[0.15rem]',
            isDarkMode ? 'transform translate-x-5 ' : ''
          )}
        />
      </button>
    </div>
  );
};

export default NightModeToggle;
