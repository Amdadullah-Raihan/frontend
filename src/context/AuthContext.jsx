import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import LoadingCircle from '../components/svgs/LoadingCircle';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const login = async (email, password, isPassHash) => {
    try {
      const response = await axiosInstance.post(`/api/users/login`, {
        email,
        password,
        isPassHash,
      });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div className='h-screen w-full flex justify-center items-center bg-gray-200 dark:bg-gray-900'><LoadingCircle className="w-10 h-10" /></div>}
    </AuthContext.Provider>
  );
};
