import React from 'react';

const SkeletonMoreCourses = () => {
  return (
    <div className="grid max-w-screen-xl grid-cols-1 gap-4 mx-auto md:grid-cols-2 lg:grid-cols-3">
      {Array(9)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="h-auto p-2 bg-white rounded-lg shadow  dark:bg-gray-800 animate-pulse"
          >
            <div className="bg-gray-200 rounded-t h-44 dark:bg-gray-700"></div>
            <div className="px-3 mt-4">
              <div className="w-4/5 h-2 bg-gray-200 dark:bg-gray-700 "></div>
              <div className="mt-6 space-y-2">
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 "></div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 "></div>
                <div className="w-2/3 h-2 bg-gray-200 dark:bg-gray-700 "></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 px-3 mt-6">
              <div className="w-full h-10 bg-gray-200 rounded-md dark:bg-gray-700"></div>
              <div className="w-full h-10 bg-gray-200 rounded-md dark:bg-gray-700"></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SkeletonMoreCourses;
