import { X } from 'lucide-react';
import React from 'react';
import { cn } from '../utils/cn';

const Modal = ({ children, isOpen, onClose, className }) => {
  // if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center w-full h-full transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      {/* Close Button */}
      <X
        onClick={onClose}
        className="absolute p-1 text-white rounded-full shadow bg-rose-500 top-4 right-4 cursor-pointer hover:bg-rose-600 transition-all duration-300 ease-in-out z-[60]"
      />
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-90  transition-opacity duration-300"
        onClick={onClose} // Clicking outside the modal closes it
      ></div>

      {/* Modal content */}
      <div
        className={cn(
          ' inline-block max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-lg transform transition-transform duration-300',
          isOpen ? 'scale-100' : 'scale-90',
          className
        )}
      >
        {/* Modal body */}
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
