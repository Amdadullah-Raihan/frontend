import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../navigations/Sidebar';
import BottomBar from '../../navigations/BottomBar';
import useScrollToTop from '../../hooks/useScrollToTop';

const Home = () => {
  const scrollRef = useRef();
  useScrollToTop(scrollRef);
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="fixed bottom-0 z-[300] flex items-center justify-center w-full h-20 px-4 bg-white border-t border-t-gray-300 md:hidden dark:bg-gray-800 dark:border-gray-700 shadow-xl ">
        <BottomBar />
      </div>
      <div
        ref={scrollRef}
        className="w-full p-3 md:p-5 lg:px-8 md:ml-[17.3rem] overflow-y-auto rounded-xl pb-20 md:pb-5"
        style={{ maxHeight: `calc(100vh - 20px)` }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
