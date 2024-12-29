import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import LoadingCircle from '../../components/svgs/LoadingCircle';
import Button from '../../components/buttons/Button';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';

const VerifyEmail = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      setIsLoading(true);
      const query = new URLSearchParams(location.search);
      const token = query.get('token');

      if (!token) {
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/api/users/verify-email?token=${token}`
        );
        if (response) {
          setMessage(response?.data?.message);
          setEmail(response?.data?.user?.email);
          setPassword(response?.data?.user?.password);
        }
      } catch (error) {
        setMessage(error.response?.data?.message || 'Verification failed.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [location]);

  const handleLogin = () => {
    // console.log(email);
    // console.log(password);

    setIsLoading(true);
    try {
      const isPassHash = true;
      login(email, password, isPassHash);
      navigate('/');
      toast.success('Successfully logged in');
    } catch (err) {
      console.error(err);
      toast.error('login Failed Try again');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) <LoadingCircle />;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full p-5 bg-white rounded-lg shadow-[0_0_2px_rgba(0,0,0,0.2)] sm:w-1/2 lg:w-1/2 text-center space-y-4">
        <h1 className="text-primary font-semibold text-xl lg:text-2xl">
          Email Verification
        </h1>
        <p>{message}</p>
        <div className="flex justify-center space-y-2">
          <Button
            variant="outline"
            onClick={handleLogin}
            className={'uppercase text-xs'}
          >
            Go To Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
