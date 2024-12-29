import React from 'react';
import { cn } from '../../../utils/cn'; // Make sure this utility function is correct

const ProgressSteps = ({ steps, setStep, currentStep }) => {
  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative flex items-center justify-between  mx-auto mb-16">
      {/* Progress bar background */}
      <div className="absolute h-1 bg-gray-300 top-1/2 w-full z-0">
        <div
          className="h-full bg-primary transition-all duration-300 ease-linear"
          style={{
            width: `${progressWidth}%`, // Directly apply the computed width
          }}
        ></div>
      </div>

      {/* Circles for steps */}
      {steps.map((s, index) => (
        <React.Fragment key={index}>
          <div
            onClick={() => setStep(s.step)}
            className={cn(
              'relative  flex z-10 items-center justify-center font-bold w-10 h-10 rounded-full border-[3px] bg-white dark:bg-gray-800 transition-colors delay-300 hover:cursor-pointer ',
              currentStep >= s.step ? 'border-primary' : '',
              currentStep === s.step
                ? 'bg-primaryDark dark:bg-primaryDark text-white'
                : ''
            )}
          >
            {s.step}
            <div
              className={cn(
                'absolute top-full text-center hidden lg:block text-nowrap transition font-medium',
                currentStep >= s.step ? 'text-primary' : ''
              )}
            >
              {s.stepTitle}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressSteps;
