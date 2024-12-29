import React from 'react';

const SkeletonMyCourses = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse relative z-0 max-w-screen-xl mx-auto">
      {
        Array.from({ length: 8 }, (_, index) => index).map((index) => (
          <div
            key={index}
            className="flex items-center  w-full h-56 bg-white dark:bg-gray-800  rounded-md shadow p-3 gap-5"
          >
            <div className="bg-gray-200 dark:bg-gray-700  w-1/2 h-full rounded"></div>
            <div className="w-1/2  h-full">
              <div className="space-y-2 mt-2">
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700  "></div>
                <div className="h-2 w-1/3 bg-gray-200 dark:bg-gray-700  "></div>
              </div>
              <div className="space-y-2 mt-10">
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700  "></div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700  "></div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700  "></div>
              </div>
              <div className="space-y-2 mt-11 flex justify-end">
                <div className="h-10 rounded-md w-3/4 bg-gray-200 dark:bg-gray-700  "></div>
              </div>
            </div>
          </div>
        ))

        // Repeat the above structure for 5 courses
      }
    </div>
  );
};

export default SkeletonMyCourses;
