import React, { useState } from 'react';
import toast from 'react-hot-toast';

import Text from '../../../components/texts/Text';
import Input from '../../../components/inputs/Input';
import Button from '../../../components/buttons/Button';
import axiosInstance from '../../../api/axiosInstance';

const AddUser = ({ updateUsers, close }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const response = await axiosInstance.post(`/api/users`, {
          username,
          email,
          password,
        });
        updateUsers(response.data.user);
        setSuccess('User Added successfully.');
        toast.success('User Added successfully!');
      } catch (err) {
        setError(err.response.data.message || 'User Add failed');
        console.error(err.message);
        setSuccess('');
        toast.error('User Add failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center w-full h-full p-4 md:py-6 md:px-5 bg-white dark:bg-gray-800 shadow-2xl rounded-xl">
        <Text variant="h4" className="mb-6 uppercase">
          Add a New User
        </Text>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-500">{success}</div>}
        <form onSubmit={handleAddUser} className="text-start  w-full">
          <div className="mb-4">
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="User's Name"
              error={errors.username}
              placeholder="Enter User's Name"
            />
          </div>
          <div className="mb-4 ">
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              error={errors.email}
              placeholder="Enter User's Email"
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              error={errors.password}
              placeholder="Enter User's Password"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 ">
            <Button
              type="none"
              loading={loading}
              className="w-full"
              variant="secondary"
              onClick={() => close()}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="w-full">
              Add User
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddUser;
