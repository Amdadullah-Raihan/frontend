import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import Button from '../../components/buttons/Button';
import Input from '../../components/inputs/Input';
import Text from '../../components/texts/Text';
import axiosInstance from '../../api/axiosInstance';
import { formatDate } from '../../utils/formatDate';
import useTitle from '../../hooks/useTitle';

const ProfileSettings = ({ user, login }) => {
  useTitle('Profile Settings');
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(user.image);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    dateOfBirth: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const validate = () => {
    let valid = true;
    let newErrors = {
      username: '',
      email: '',
      password: '',
      dateOfBirth: '',
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

    setErrors(newErrors);
    return valid;
  };

  const handleUpdateUser = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append('userId', user._id);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('currentPassword', password);
      formData.append('image', image);

      try {
        const response = await axiosInstance.put(
          `/api/users/updateUserInfo`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.data.user) {
          const isPassHash = false;
          login(email, password, isPassHash);
        }
        toast.success('User Profile updated successfully!');
      } catch (error) {
        console.error('Error updating user:', error.response);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center  ">
      <div className="w-full p-5 bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_2px_rgba(0,0,0,0.2)]  max-w-sm">
        <div className="flex items-start justify-between">
          <Text variant="h5" className="mb-4 font-extrabold">
            Edit Profile
          </Text>
          <Text className="mt-1 text-gray-500 dark:text-gray-400">
            Joined: {formatDate(user?.createdAt)}
          </Text>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-500">{success}</div>}
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="flex items-center">
            {previewImage ? (
              <img
                src={previewImage}
                alt="User"
                className="object-cover w-20 h-20 rounded-full"
              />
            ) : (
              <div className="flex items-center justify-center w-20 h-20 bg-gray-700 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 106 16 8 8 0 000-16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            <label className="ml-4 text-blue-500 cursor-pointer hover:text-blue-600 dark:text-blue-100 dark:hover:text-blue-200">
              Upload/Update Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="mb-2">
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Update Username"
              error={errors.username}
            />
          </div>
          <div className="mb-2">
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Update Email"
              error={errors.email}
              disabled={true}
            />
          </div>
          <div className="mb-2">
            <div className="flex justify-between mb-1">
              <label htmlFor="" className="font-medium">
                <span>{user.dateOfBirth ? 'Update' : 'Add'}</span> Date of Birth
              </label>
              {user.dateOfBirth && (
                <span className="text-gray-500">
                  {formatDate(user.dateOfBirth)}
                </span>
              )}
            </div>
            <Input
              type="date"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              error={errors.email}
            />
          </div>
          <div className="mb-2">
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Your Password"
              placeholder="Enter your password to update the info"
              error={errors.password}
              icon={
                password &&
                (showPassword ? (
                  <Eye
                    size={18}
                    className="text-gray-900"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeOff
                    size={18}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ))
              }
            />
          </div>
          <Button loading={loading} className="w-full">
            Update Info
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
