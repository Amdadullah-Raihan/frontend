import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Accordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 rounded-md">
      <button
        className="flex justify-between items-center w-full p-4  text-left bg-white dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
        onClick={toggleAccordion}
      >
        <span className="font-medium">{title}</span>

        <ChevronDown
          className={`transition duration-300 ${isOpen ? '-rotate-180' : 'rotate-0'}`}
          size={18}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-500  ease-in-out ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="p-4  bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-400 rounded-md">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
