import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import log from '../utils/log';

// Create context
const CreateCourseContext = createContext();

// Custom hook for consuming the context
export const useCreateCourse = () => useContext(CreateCourseContext);

// Context provider
export const CreateCourseProvider = ({ children }) => {
  // State for course data
  const [courseData, setCourseData] = useState({
    _id: '',
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    level: '',
    language: '',
    price: 0,
    discount: 0,
    currency: '',
    modules: [],
    faqs: [{ question: '', answer: '' }],
    tags: [],
  });

  // State for step management
  const steps = [
    { step: 1, stepTitle: 'Course Info' },
    { step: 2, stepTitle: 'Pricing' },
    { step: 3, stepTitle: 'Faqs' },
    { step: 4, stepTitle: 'Course Contents' },
    { step: 5, stepTitle: 'Quizzes' },
    { step: 6, stepTitle: 'Publish' },
  ];
  const [currentStep, setCurrentStep] = useState(steps[0]);

  // Update course data function
  const updateCourseData = (key, value) => {
    setCourseData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Step management functions
  const nextStep = () => {
    setCurrentStep((prevStep) => {
      const nextIndex =
        steps.findIndex((step) => step.step === prevStep.step) + 1;
      return steps[nextIndex] || prevStep; // Prevent going beyond last step
    });
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => {
      const prevIndex =
        steps.findIndex((step) => step.step === prevStep.step) - 1;
      return steps[prevIndex] || prevStep; // Prevent going below first step
    });
  };

  const goToStep = (stepNumber) => {
    const targetStep = steps.find((step) => step.step === stepNumber);
    if (targetStep) setCurrentStep(targetStep);
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      const savedCourse = localStorage.getItem('savedCourse');

      if (savedCourse) {
        try {
          const response = await axiosInstance.post(
            `/api/courses/${savedCourse}`
          );

          if (response.status === 200) {
            const courseData = response.data;

            setCourseData(courseData);
          }
        } catch (error) {
          console.error('Error fetching course data:', error);
        }
      }
    };

    fetchCourseData();
  }, []);

  return (
    <CreateCourseContext.Provider
      value={{
        courseData,
        updateCourseData,
        steps,
        currentStep,
        nextStep,
        previousStep,
        goToStep,
        setCourseData,
      }}
    >
      {children}
    </CreateCourseContext.Provider>
  );
};
