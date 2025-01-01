import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import loginVector from '../../assets/login-vector.png';
import Button from '../../components/buttons/Button';
import Divider from '../../components/dividers/Divider';
import Input from '../../components/inputs/Input';
import Text from '../../components/texts/Text';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import Modal from '../../components/Modal';

import LogoWhite from '../../components/logos/LogoWhite';
import Logo from '../../components/logos/Logo';
import axiosInstance from '../../api/axiosInstance';
import CopyRight from '../rights/CopyRight';
import { useSelector } from 'react-redux';

const Login = () => {
  const { isDarkMode } = useSelector((state) => state.theme);

  // Local States
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [forgetPassEmail, setForgetPassEmail] = useState('');
  const [forgetPassError, setForgetPassError] = useState('');
  const [forgetPassLoading, setForgetPassLoading] = useState(false);

  const validate = () => {
    let valid = true;
    let newErrors = { email: '', password: '' };
    setServerError('');

    if (!email) {
      valid = false;
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      valid = false;
      newErrors.email = 'Email is  invalid';
    }

    if (!password) {
      valid = false;
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      valid = false;
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const isPassHash = false;
        await login(email, password, isPassHash);
        navigate('/');
        toast.success('Successfully logged in');
      } catch (err) {
        setServerError(err.response.data.message);
        console.error('login err: ', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgetPassword = async () => {
    setForgetPassLoading(true);

    if (!forgetPassEmail) {
      setForgetPassError('Email is ');
    } else if (!/\S+@\S+\.\S+/.test(forgetPassEmail)) {
      setForgetPassError('Email is invalid');
    }

    try {
      const response = await axiosInstance.get(
        `/api/users/request-forgetPass?email=${forgetPassEmail}`
      );
      if (response) {
        // console.log(response);
        toast.success(
          'Forget password request approved! Please check your email for continue the process.'
        );
      }
    } catch (err) {
      toast.error('Password change Failed: ', err);
      console.error('Password change Failed: ', err);
    } finally {
      setForgetPassLoading(false);
      setIsOpen(false);
    }
  };
  useEffect(() => {
    if (serverError && serverError.includes('support')) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [serverError]);
  return (
    <div className="dark:bg-gray-900">
      <div className="grid items-center justify-center w-full max-w-screen-lg min-h-screen grid-cols-1 p-5 mx-auto transition-transform duration-300 translate-x-0 md:px-8 lg:px-16 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center w-full p-6 text-gray-700 bg-white border shadow dark:bg-gray-800 dark:border-gray-800 md:max-w-sm rounded-xl dark:text-white">
          <div className="mb-6 space-y-4 text-center ">
            {isDarkMode ? (
              <LogoWhite className="max-w-[70%] mx-auto" />
            ) : (
              <Logo className="max-w-[70%] mx-auto" />
            )}
            <Text className="text-gray-500 dark:text-gray-300">
              Log into your account
            </Text>
          </div>
          <form onSubmit={handleLogin} className="w-full px-5 pb-4 text-start">
            <div className="mb-4">
              <Input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                error={errors.email}
                placeholder="Enter your email address"
                icon={<Mail size={18} />}
              />
            </div>
            <div className="mb-4">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                error={errors.password}
                placeholder="Enter your password"
                icon={
                  password ? (
                    showPassword ? (
                      <Eye size={18} onClick={() => setShowPassword(false)} />
                    ) : (
                      <EyeOff size={18} onClick={() => setShowPassword(true)} />
                    )
                  ) : (
                    <LockKeyhole
                      size={18}
                      className="cursor-pointer hover:text-primary"
                    />
                  )
                }
              />
            </div>
            {serverError && (
              <div className="mb-4 text-red-500">{serverError}</div>
            )}

            <div className="mb-6 text-right">
              <Link
                className="font-medium text-blue-800 cursor-pointer dark:text-primary"
                onClick={() => setIsOpen(true)}
              >
                Forgot Password?
              </Link>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10"
                >
                  {!loading ? 'Sign In' : 'Singing in...'}
                </Button>
              </div>
              <Divider label="Or" />
              <div className="flex items-center justify-between">
                <Link to="/register" className="w-full">
                  <Button
                    type="none"
                    variant="outline"
                    className="w-full h-10"
                    disabled={loading}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </div>
        <div className="items-center justify-center hidden md:w-full md:flex">
          <img src={loginVector} alt="Login Vector" />
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4">
          <Text variant="h3" className="mb-5 text-center">
            Forgot Password?
          </Text>
          <div className="max-w-2xl mb-6 min-w-80">
            <Input
              type="text"
              id="email1"
              value={forgetPassEmail}
              onChange={(e) => setForgetPassEmail(e.target.value)}
              label="Email"
              error={forgetPassError}
              placeholder="Enter your email address"
              icon={<Mail size={18} />}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Button
              className="w-full "
              variant="danger"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              loading={forgetPassLoading}
              className="w-full "
              onClick={handleForgetPassword}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>

      <CopyRight />
    </div>
  );
};

export default Login;
