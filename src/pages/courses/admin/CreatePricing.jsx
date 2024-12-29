import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SelectInput from '../../../components/inputs/SelectInput';
import Input from '../../../components/inputs/Input';
import { Percent, Save } from 'lucide-react';
import { useCreateCourse } from '../../../context/CreateCourseContext';
import log from '../../../utils/log';
import Text from '../../../components/texts/Text';
import Button from '../../../components/buttons/Button';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';

const CreatePricing = () => {
  const { courseData, updateCourseData, nextStep, previousStep } =
    useCreateCourse();
  const [currencies, setCurrencies] = useState([]);
  const [errors, setErrors] = useState({
    price: '',
    discount: '',
    currency: '',
  });
  const [saving, setSaving] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!courseData.price && courseData.price !== 0) {
      newErrors.price = 'Please provide a price for your course.';
    }
    if (!courseData.currency) {
      newErrors.currency = 'Please select a currency.';
    }
    if (courseData.discount < 0 || courseData.discount > 100) {
      newErrors.discount = 'Discount must be between 0 and 100.';
    }

    setErrors(newErrors);

    // If no errors, return true
    return Object.keys(newErrors).length === 0;
  };

  const savePricing = async () => {
    const validated = validate();
    if (!validated) return;

    try {
      setSaving(true);
      const updatedPricing = await axiosInstance.put(
        '/api/courses/update/pricing',
        {
          id: courseData._id,
          currency: courseData.currency,
          price: courseData.price ? courseData.price : 0,
          discount: courseData.discount ? courseData.discount : 0,
        }
      );

      if (updatedPricing.status === 200) {
        nextStep();
        toast.success('Pricing updated successfully!');
      }
    } catch (err) {
      log.error('Error saving pricing:', err);
      toast.error('Failed to save pricing. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          'https://openexchangerates.org/api/currencies.json?app_id=YOUR_API_KEY'
        );
        setCurrencies(Object.entries(response.data)); // Convert object to array of [code, name]
      } catch (error) {
        log.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  if (!courseData._id) {
    toast.error('Please complete the course info section before proceeding.');
    previousStep();
  }

  return (
    <div className="border dark:border-gray-600 rounded-lg p-5">
      <div>
        <Input
          type="number"
          label="Price"
          placeholder="Enter your course price"
          className="mb-1"
          value={courseData.price || ''}
          onChange={(e) => updateCourseData('price', e.target.value)}
          error={errors.price}
        />
        <Text className="mb-4 text-sm">
          Note: Leaving price empty will create a free course.
        </Text>
        <SelectInput
          label="Currency"
          value={courseData.currency}
          onChange={(e) => updateCourseData('currency', e.target.value)}
          placeholder="Select a Currency"
          error={errors.currency}
          className="mb-4"
          options={currencies.map(([code, name]) => ({
            value: code,
            label: `${name} (${code})`,
          }))}
        />
        <Input
          type="number"
          value={courseData.discount || ''}
          onChange={(e) => updateCourseData('discount', e.target.value)}
          label="Discount (In Percentage)"
          className="mb-1"
          placeholder="Enter discount"
          error={errors.discount}
          icon={
            <Percent size={18} className="text-gray-400 dark:text-gray-500 " />
          }
        />
        <Text className="mb-4 text-sm">
          Note: Leaving discount empty will create a course with zero(0) percent
          discount.
        </Text>

        <Button
          variant="success"
          onClick={savePricing}
          disabled={saving}
          className="ml-auto mt-4"
        >
          <Save size={18} />
          {saving ? 'Saving...' : courseData._id ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default CreatePricing;
