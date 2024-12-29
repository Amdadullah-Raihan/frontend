import React from 'react';

const SkeletonTable = () => {
  return (
    <div className="animate-pulse space-y-4 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800   rounded-lg   ">
        <div className="h-6 rounded bg-gray-300 dark:bg-gray-600 w-32"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700   w-32 max-w-1/2 rounded-md"></div>
      </div>
      <div className=" bg-white dark:bg-gray-800   rounded-lg overflow-hidden  divide-y divide-gray-200 dark:divide-gray-700 ">
        {[...Array(15)].map((_, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4  ${index === 0 && 'bg-gray-200 dark:bg-gray-700'} `}
          >
            <div className="h-6  bg-gray-200 dark:bg-gray-700   rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700   rounded w-1/6"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700   rounded w-1/6"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700   rounded w-1/6"></div>

            {index == 0 ? (
              <div className="h-6 bg-gray-200 dark:bg-gray-700   rounded w-28"></div>
            ) : (
              <div className="flex  gap-4 w-28 ">
                <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700  "></div>
                <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700  "></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTable;
