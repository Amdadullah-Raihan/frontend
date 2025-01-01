import React, { useState } from 'react';

import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import Button from '../../components/buttons/Button';
import Input from '../../components/inputs/Input';
import Text from '../../components/texts/Text';
import axiosInstance from '../../api/axiosInstance';

function Payment({ course, setOpenPayment }) {
  const { user } = useAuth();

  const [currency, setCurrency] = useState('BDT');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleCourseEnroll = async () => {
    setError('');

    if (!phone) {
      return setError('Phone Number is Required');
    }
    if (!currency) {
      return setError('Currency is Required');
    }
    if (!user.email) {
      return setError('User Not Found');
    }

    const data = {
      courseId: course?._id,
      userId: user?.user?._id,
      username: user?.user?.username,
      email: user?.user?.email,
      price: course?.price * 0.8,
      title: course?.title,
      currency,
      phone,
    };

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/api/payment/init`, data);
      if (response) {
        // console.log(response);
        window.location.href = response.data.url;
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Course Enroll failed');
      setLoading(false);
    }
  };

  return (
    <div className="p-5 w-full min-w-[300px]">
      <Text variant="h3" className="my-5 font-extrabold text-center">
        Payment Form
      </Text>

      {error && (
        <p className="text-sm text-center text-red-600 font-semibold mb-5">
          {error}
        </p>
      )}

      <div className="mb-4">
        <Input
          type="text"
          id="email1"
          value={user.email}
          label="Email"
          disabled={true}
        />
      </div>

      <div className="mb-4">
        <Input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          label="Phone Number"
        />
      </div>

      <div className="flex flex-col space-y-2 my-5">
        <label htmlFor="currency" className="text-sm font-medium text-gray-700">
          currency:
        </label>
        <select
          id="currency"
          value={currency}
          onChange={handleCurrencyChange}
          className="block w-full px-3 py-2 text-sm border dark:bg-gray-700 dark:border-gray-800 border-gray-300 rounded-md focus:outline-primary"
        >
          <option value="BDT">Bangladeshi Taka (BDT)</option>
          <option value="USD">US Dollar (USD)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="GBP">British Pound (GBP)</option>
          <option value="INR">Indian Rupee (INR)</option>
          <option value="AUD">Australian Dollar (AUD)</option>
          <option value="CAD">Canadian Dollar (CAD)</option>
          <option value="SGD">Singapore Dollar (SGD)</option>
          <option value="MYR">Malaysian Ringgit (MYR)</option>
          <option value="JPY">Japanese Yen (JPY)</option>
        </select>
      </div>

      <div className="mb-4">
        <Input
          type="Number"
          id="price"
          value={course?.price * 0.8}
          label="Price"
          className="border-none bg-background w-full"
          disabled={true}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="danger"
          onClick={() => setOpenPayment(false)}
          className="w-full text-[0.8rem]"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleCourseEnroll}
          className="w-full text-[0.8rem]"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm'}
        </Button>
      </div>
    </div>
  );
}

export default Payment;
