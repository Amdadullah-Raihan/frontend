import { useMemo } from 'react';

const useApiUrl = () => {
    const apiUrl = useMemo(() => {
        if (process.env.NODE_ENV === 'development') {
            return 'http://localhost:5000';
        } else {
            return 'https://lms-backend-ivory.vercel.app';
        }
    }, []);

    return apiUrl;
};

export default useApiUrl;
