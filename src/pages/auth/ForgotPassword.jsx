import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import Input from '../../components/inputs/Input';
import Button from '../../components/buttons/Button';
import axiosInstance from '../../api/axiosInstance';
import Text from '../../components/texts/Text';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfrimPassword] = useState(false);

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    let newErrors = {
      password: '',
      confirmPassword: '',
    };
    setError('');
    setSuccess('');

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

    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (validate()) {
      setLoading(true);
      try {
        const response = await axiosInstance.post(
          `/api/users/changePassword?token=${token}`,
          {
            password,
          }
        );
        // console.log(response);
        if (response) {
          setSuccess('Password changed Successfully!');
          toast.success(
            'Password changed Successfully done!, Please login with your new password'
          );
          navigate('/login');
        }
      } catch (err) {
        setError(err.response.data.message || 'Registration failed');
        console.error(err.message);
        setSuccess('');
      } finally {
        setLoading(false);
      }
    }
  };

  // console.log(password);
  // console.log(confirmPassword);

  return (
    <div className="w-full bg-background dark:bg-gray-900">
      <div className="flex justify-center items-center h-screen p-5 md:max-w-screen-sm mx-auto w-full ">
        <div className="w-full p-5 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow sm:w-1/2 lg:w-1/2 text-center space-y-4">
          <Text variant="h3" className="mb-5">
            Change Password
          </Text>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          {success && <div className="mb-4 text-green-500">{success}</div>}
          <form
            onSubmit={handleRegister}
            className="w-full pb-4 lg:px-5 text-start space-y-4"
          >
            <div>
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
            <div>
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

            <div className="flex items-center justify-center my-5">
              <Button type={'submit'} loading={loading} className="w-full">
                Change Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
