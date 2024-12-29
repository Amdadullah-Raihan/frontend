import { useEffect } from 'react';

const useTitle = (title) => {
  useEffect(() => {
    document.title = title
      ? `${title} - Octopi Digital LMS`
      : 'Octopi Digital LMS';
  }, [title]);
};

export default useTitle;
