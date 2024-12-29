import { SunMoon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { cn } from '../utils/cn';
import { toggleNightMode } from '../store/theme/theme.slice';

const NightModeToggle = () => {
  const { isDarkMode } = useSelector((state) => state.theme);
  const dispath = useDispatch();

  return (
    <div
      onClick={() => dispath(toggleNightMode())}
      className="flex items-center justify-between py-2 pl-[0.8rem] pr-1  md:pl-[0.35rem] cursor-pointer"
    >
      <span className="flex items-center gap-2 mr-3 text-sm text-gray-800 md:font-medium dark:text-white">
        <SunMoon size={20} />
        Night Mode
      </span>
      <button
        className={cn(
          'relative w-10 h-5 rounded-full transition-colors duration-300 shadow-inner ',
          isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
        )}
      >
        <span
          className={cn(
            'absolute bg-white shadow-[0_0_1px_black]  rounded-full transition-transform duration-300 w-4 h-4 top-[0.15rem] left-[0.15rem]',
            isDarkMode ? 'transform translate-x-5 ' : ''
          )}
        />
      </button>
    </div>
  );
};

export default NightModeToggle;
