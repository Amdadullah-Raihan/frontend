import React, { useState } from 'react';
import toast from 'react-hot-toast';

import Text from '../../../components/texts/Text';
import Input from '../../../components/inputs/Input';
import Button from '../../../components/buttons/Button';
import axiosInstance from '../../../api/axiosInstance';

const UpdateUser = ({ updateUsersData, updateUsersList, close }) => {
  const [username, setUsername] = useState(updateUsersData.username);
  const [email, setEmail] = useState(updateUsersData.email);
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

    setErrors(newErrors);
    return valid;
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const response = await axiosInstance.put(`/api/users`, {
          userId: updateUsersData._id,
          username,
          email,
          password,
        });
        updateUsersList(response.data.user);
        setSuccess('User Updated successful.');
        toast.success('User Updated successfully!');
        close();
      } catch (err) {
        setError(err.response.message || 'User Update failed');
        console.error(err.message);
        setSuccess('');
        toast.error('User Update failed');
      } finally {
        setLoading(false);
      }
    } else {
      console.error('something wrong');
    }
  };
  return (
    <main>
      <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-white dark:bg-gray-800 shadow-2xl rounded-xl">
        <Text variant="h3" className="mb-4 font-extrabold">
          Update user
        </Text>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-500">{success}</div>}
        <form onSubmit={handleUpdateUser} className="text-start">
          <div className="mb-4">
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Update Username"
              error={errors.username}
              className="border-none bg-background"
            />
          </div>
          <div className="mb-4">
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Update Email"
              error={errors.email}
              className="border-none bg-background"
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Update Password"
              error={errors.password}
              className="border-none bg-background"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 ">
            <Button
              type="none"
              loading={loading}
              className="w-full"
              variant="danger"
              onClick={() => close()}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="w-full">
              Update
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default UpdateUser;
