import React from 'react';

const SkeletonCertificates = () => {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex items-center w-full h-12 p-4 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-800 animate-pulse">
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 md:w-1/3 lg:w-1/5"></div>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }, (_, index) => (
          <div
            key={index}
            className="flex w-full h-56 overflow-hidden bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-800 animate-pulse "
          >
            <div className="w-1/2 h-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col justify-between w-full p-4">
              <div className="w-full space-y-2">
                <div className="h-2 bg-gray-200 dark:bg-gray-700"></div>
                <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="w-full space-y-2">
                <div className="w-1/2 h-2 mx-auto bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700"></div>
                <div className="w-4/5 h-2 mx-auto bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="w-full space-y-2">
                <div className="h-2 bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonCertificates;
