import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = (scrollRef) => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        left: 0,
        // behavior: 'smooth',
      });
    }
  }, [pathname, scrollRef?.current]);

  return scrollRef;
};

export default useScrollToTop;
