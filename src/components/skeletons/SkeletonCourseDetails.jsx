import React from 'react';

const SkeletonCourseDetails = () => {
  return (
    <div className="space-y-4 animate-pulse max-w-screen-xl mx-auto">
      <div className="h-14 bg-white dark:bg-gray-800   border dark:border-gray-800   rounded-lg flex items-center px-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700   w-full md:w-1/2  lg:w-1/3"></div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="h-72 sm:h-[28rem] lg:h-[30rem] rounded-lg border dark:border-gray-800   bg-white dark:bg-gray-800   w-full p-4  space-y-2">
          <div className="w-full h-[85%] bg-gray-200 dark:bg-gray-700   rounded-md"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700   w-full md:w-1/2  lg:w-1/3"></div>
        </div>
        <div className="h-72 sm:h-[28rem] lg:h-[30rem] rounded-lg border dark:border-gray-800   bg-white dark:bg-gray-800   w-full lg:w-2/5 space-y-2 p-4 overflow-hidden">
          {Array(9)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="h-11 bg-gray-200 dark:bg-gray-700   rounded-md w-full"
              ></div>
            ))}
        </div>
      </div>

      <div className="  rounded-lg border dark:border-gray-800   bg-white dark:bg-gray-800   p-5 space-y-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700   mb-6 w-1/2  lg:w-1/3"></div>
        <div className="space-y-6 ">
          {Array(7)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="h-2 bg-gray-200 dark:bg-gray-700   rounded-md w-full"
              ></div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonCourseDetails;
