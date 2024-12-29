import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import loginVector from '../../assets/login-vector.png';
import Button from '../../components/buttons/Button';
import Divider from '../../components/dividers/Divider';
import Input from '../../components/inputs/Input';
import Text from '../../components/texts/Text';
import axiosInstance from '../../api/axiosInstance';
import { useTheme } from '../../context/ThemeContext';
import LogoWhite from '../../components/logos/LogoWhite';
import Logo from '../../components/logos/Logo';
import CopyRight from '../rights/CopyRight';

const Register = () => {
  const { isDarkMode } = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfrimPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    let newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    setError('');
    setSuccess('');

    if (!username) {
      valid = false;
      newErrors.username = 'Username is required';
    }

    if (!email) {
      valid = false;
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      valid = false;
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      valid = false;
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      valid = false;
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      valid = false;
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (password !== confirmPassword) {
      valid = false;
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        await axiosInstance.post(`/api/users/register`, {
          username,
          email,
          password,
        });
        setSuccess(
          'Registration successful. Please verify your Email to Login...'
        );
      } catch (err) {
        setError(err.response.data.message || 'Registration failed');
        console.error(err.message);
        setSuccess('');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white">
      <div className="flex items-center justify-center w-full h-screen max-w-screen-xl p-4 mx-auto lg:p-6 ">
        <div className="flex flex-col items-center justify-center max-h-[95vh] overflow-y-auto w-full p-6 bg-white dark:bg-gray-800 dark:border-gray-800 border shadow md:w-1/2 max-w-sm rounded-xl">
          <div className="mb-6 space-y-4 text-center">
            {isDarkMode ? (
              <LogoWhite className="max-w-[70%] mx-auto" />
            ) : (
              <Logo className="max-w-[70%] mx-auto" />
            )}
            <Text className="text-gray-500 dark:text-gray-300">
              Register as new user
            </Text>
          </div>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          {success && <div className="mb-4 text-green-500">{success}</div>}
          <form
            onSubmit={handleRegister}
            className="w-full pb-4 lg:px-5 text-start"
          >
            <div className="mb-2">
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                label="Name"
                error={errors.username}
                placeholder="Enter your full name"
              />
            </div>
            <div className="mb-2">
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                error={errors.email}
                placeholder="Enter your email address"
              />
            </div>
            <div className="mb-2">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                error={errors.password}
                placeholder="Enter your password"
                icon={
                  password &&
                  (showPassword ? (
                    <Eye size={18} onClick={() => setShowPassword(false)} />
                  ) : (
                    <EyeOff size={18} onClick={() => setShowPassword(true)} />
                  ))
                }
              />
            </div>
            <div className="mb-2">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="Confirm Password"
                error={errors.confirmPassword}
                placeholder="Re-enter your password"
                icon={
                  confirmPassword &&
                  (showConfirmPassword ? (
                    <Eye
                      size={18}
                      onClick={() => setShowConfrimPassword(false)}
                    />
                  ) : (
                    <EyeOff
                      size={18}
                      onClick={() => setShowConfrimPassword(true)}
                    />
                  ))
                }
              />
            </div>

            <div className="flex flex-col items-center justify-between gap-2 mt-6">
              <Button disabled={loading} className="w-full">
                {!loading ? 'Sign Up' : 'Sining up...'}
              </Button>
              <Divider label="Or" />
              <Link to="/login" className="w-full">
                <Button
                  type="none"
                  variant="outline"
                  className="w-full h-10"
                  disabled={loading}
                >
                  Login
                </Button>
              </Link>
            </div>
          </form>
        </div>
        <div className="hidden lg:block">
          <img src={loginVector} alt="Login Vector Image" />
        </div>
      </div>
      <CopyRight />
    </div>
  );
};

export default Register;
