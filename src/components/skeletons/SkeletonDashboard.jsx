import React from 'react';
import { useAuth } from '../../context/AuthContext';

const SkeletonDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="h-2 bg-gray-200 dark:bg-gray-700   mb-4 max-w-32"></div>
      {user.role === 'student' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-40 bg-white dark:bg-gray-800   rounded-lg border dark:border-gray-800   animate-pulse p-4 flex flex-col justify-between"
              >
                <div className="h-5  w-5 rounded-md bg-gray-200 dark:bg-gray-700  "></div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700   w-1/4"></div>
                  <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-700  "></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-gray-800   border dark:border-gray-800   rounded-lg h-96 w-2/5 animate-pulse flex items-center justify-center">
              <div className="relative h-72 w-72 rounded-full bg-gray-200 dark:bg-gray-700  ">
                <div className="absolute top-0 left-0 h-1/2 w-full rounded-t-full bg-gray-200 dark:bg-gray-700  "></div>
                <div className="absolute bottom-0 right-0 h-1/2 w-full rounded-b-full bg-gray-300"></div>
                <div className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-white dark:bg-gray-800  "></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800   border dark:border-gray-800   rounded-lg h-96 w-3/5 animate-pulse p-6">
              <div className="border dark:border-gray-800  -l-4 w-full h-full   -b-4 flex justify-between px-10 items-end">
                <div className="h-1/5 w-12 bg-gray-200 dark:bg-gray-700   rounded-t-lg border dark:border-gray-800   animate-pulse p-4 flex items-center justify-between"></div>
                <div className="h-2/5 w-12 bg-gray-200 dark:bg-gray-700   rounded-t-lg border dark:border-gray-800   animate-pulse p-4 flex items-center justify-between"></div>
                <div className="h-5/6 w-12 bg-gray-200 dark:bg-gray-700   rounded-t-lg border dark:border-gray-800   animate-pulse p-4 flex items-center justify-between"></div>
                <div className="h-4/6 w-12 bg-gray-200 dark:bg-gray-700   rounded-t-lg border dark:border-gray-800   animate-pulse p-4 flex items-center justify-between"></div>
                <div className="h-3/5 w-12 bg-gray-200 dark:bg-gray-700   rounded-t-lg border dark:border-gray-800   animate-pulse p-4 flex items-center justify-between"></div>
                <div className="h-2/5 w-12 bg-gray-200 dark:bg-gray-700   rounded-t-lg border dark:border-gray-800   animate-pulse p-4 flex items-center justify-between"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-gray-800   border dark:border-gray-800   rounded-lg h-96 w-3/5 animate-pulse"></div>
            <div className="bg-white dark:bg-gray-800   border dark:border-gray-800   rounded-lg h-96 w-2/5 animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 ">
            <div className="bg-white dark:bg-gray-800   border dark:border-gray-800   rounded-lg h-96 w-full animate-pulse flex items-center justify-center">
              <div className="relative h-72 w-72 rounded-full bg-gray-200 dark:bg-gray-700  ">
                <div className="absolute top-0 left-0 h-1/2 w-full rounded-t-full bg-gray-200 dark:bg-gray-700  "></div>
                <div className="absolute bottom-0 right-0 h-1/2 w-full rounded-b-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-white dark:bg-gray-800  "></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="  bg-white dark:bg-gray-800   rounded-lg border dark:border-gray-800   animate-pulse p-4 flex flex-col justify-between"
                >
                  <div className="h-5  w-5 rounded-md bg-gray-200 dark:bg-gray-700  "></div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700   w-1/4"></div>
                    <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-700  "></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="border dark:border-gray-800  -b p-2 bg-white dark:bg-gray-800   rounded-lg animate-pulse"
              >
                <div className="flex gap-2">
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700   rounded-full"></div>
                  <div className="flex flex-col justify-between py-4">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700   w-32">
                      {' '}
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700   w-28">
                      {' '}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkeletonDashboard;
