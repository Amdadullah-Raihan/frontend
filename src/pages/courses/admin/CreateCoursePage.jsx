import React, { useEffect, useState } from 'react';
import { useCreateCourse } from '../../../context/CreateCourseContext';
import CourseInfo from './CreateCourseInfo';
import CreatePricing from './CreatePricing';
import CreateFaqs from './CreateFaqs';
import CreateCourseContents from './CreateCourseContents';
import CreateQuiz from './CreateQuiz';
import CoursePreview from './CoursePreview';
import ProgressSteps from './ProgressSteps';
import Button from '../../../components/buttons/Button';
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import log from '../../../utils/log';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import Modal from '../../../components/Modal';
import Text from '../../../components/texts/Text';
import { useLocation } from 'react-router-dom';

const CreateCoursePage = () => {
  const { pathname } = useLocation();

  const {
    courseData,

    currentStep,
    steps,
    nextStep,
    previousStep,
    goToStep,
    setCourseData,
  } = useCreateCourse();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const updateCourseStatus = async () => {
    setUpdatingStatus(true);
    let status;
    if (courseData.status === 'draft') {
      status = 'published';
    } else {
      status = 'draft';
    }
    try {
      const response = await axiosInstance.put('/api/courses/update/status', {
        courseId: courseData._id,
        status,
      });
      if (response.status === 200) {
        setCourseData(response.data.course);
        if (response.data.course.status === 'published') {
          toast.success('Course published successfully');
        } else {
          toast.success('Course unpublished successfully');
        }
      }
    } catch (err) {
      log.error('Error updatingStatus course: ', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    // This ensures the step title updates when the step changes
    document.title = currentStep.stepTitle;
  }, [currentStep]);

  useEffect(() => {
    if (courseData._id && !pathname.includes('/courses/update')) {
      setShowModal(true);
    }
  }, [courseData._id]);

  return (
    <div className="bg-white rounded-xl max-w-screen-xl mx-auto py-8 dark:bg-gray-800 px-8 lg:px-12 space-y-8">
      <ProgressSteps
        steps={steps}
        currentStep={currentStep.step}
        setStep={goToStep}
      />

      {/* Render step components based on currentStep */}
      {currentStep.step === 1 && <CourseInfo />}
      {currentStep.step === 2 && <CreatePricing />}
      {currentStep.step === 3 && <CreateFaqs />}
      {currentStep.step === 4 && <CreateCourseContents />}
      {currentStep.step === 5 && <CreateQuiz />}
      {currentStep.step === 6 && <CoursePreview />}

      <div className="mt-5 grid gap-4 grid-cols-2 md:max-w-96 ml-auto">
        <Button
          onClick={previousStep}
          disabled={currentStep.step === 1}
          className="gap-1 justify-start"
        >
          <ChevronLeft size={18} /> Previous
        </Button>

        {currentStep.step === steps.length ? (
          <Button
            onClick={updateCourseStatus}
            variant="success"
            disabled={updatingStatus}
          >
            {courseData.status === 'published' ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
            {updatingStatus
              ? courseData.status === 'published'
                ? 'Unpublishing...'
                : 'Publishing...'
              : courseData.status === 'published'
                ? 'Unpublish'
                : 'Publish'}
          </Button>
        ) : (
          <Button onClick={nextStep} className="justify-end">
            Next <ChevronRight size={18} />
          </Button>
        )}
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="max-w-sm"
      >
        <div className="p-4 text-center">
          <Text className="text-lg font-semibold mb-2">
            Resume Your Course Creation
          </Text>
          <Text className="mb-4">
            It looks like you have an unfinished course draft. You can pick up
            where you left off or start fresh with a new course.
          </Text>
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Continue Draft
            </Button>
            <button
              onClick={() => {
                localStorage.removeItem('savedCourse');
                setCourseData({
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
                setShowModal(false);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Start New Course
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateCoursePage;
