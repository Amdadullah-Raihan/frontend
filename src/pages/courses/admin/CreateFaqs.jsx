import React, { useEffect, useRef, useState } from 'react';
import Input from '../../../components/inputs/Input';
import Textarea from '../../../components/inputs/Textarea';
import Button from '../../../components/buttons/Button';
import Tooltip from '../../../components/Tooltip';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useCreateCourse } from '../../../context/CreateCourseContext';
import toast from 'react-hot-toast';
import log from '../../../utils/log';
import axiosInstance from '../../../api/axiosInstance';
import LoadingCircle from '../../../components/svgs/LoadingCircle';

const CreateFaqs = () => {
  const { courseData, updateCourseData, nextStep, goToStep } =
    useCreateCourse();
  const [deletingFaq, setDeletingFaq] = useState('');
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef();

  const handleAddFaq = () => {
    const lastFaq = courseData.faqs[courseData.faqs.length - 1];

    // Check if the last FAQ is filled out
    if (
      (courseData.faqs.length && !lastFaq?.question.trim()) ||
      !lastFaq?.answer.trim()
    ) {
      toast.error('Please fill out the current FAQ before adding a new one.');
      return;
    }

    // Add a new FAQ
    const updatedFaqs = [...courseData.faqs, { question: '', answer: '' }];
    updateCourseData('faqs', updatedFaqs);

    // Wait a little for the new FAQ to be rendered and scroll to it
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleRemoveFaq = async (index) => {
    const updatedFaqs = courseData.faqs.filter((_, i) => i !== index);
    const { _id: courseId } = courseData; // Assuming courseData contains the course ID
    const faqId = courseData.faqs[index]._id; // Assuming each FAQ has a unique `_id`
    if (faqId) {
      try {
        setDeletingFaq(faqId);
        await axiosInstance.delete(`/api/courses/faqs/delete`, {
          data: {
            faqId,
            courseId,
          },
        });
        updateCourseData('faqs', updatedFaqs);
        toast.success(`Removed FAQ ${index + 1}`);
      } catch (error) {
        console.error('Error removing FAQ:', error);
        toast.error('Failed to remove FAQ');
      } finally {
        setDeletingFaq('');
      }
    } else {
      updateCourseData('faqs', updatedFaqs);
    }
  };

  const saveFaqs = async () => {
    try {
      setSaving(true);
      const savedFaqs = await axiosInstance.put('/api/courses/update/faqs', {
        courseId: courseData._id,
        faqs: courseData.faqs,
      });

      if (savedFaqs.status === 200) {
        toast.success('FAQs saved successfully!');
        log.success('saved faqs', savedFaqs);
        updateCourseData('faqs', savedFaqs.data.updatedCourseData.faqs);
        nextStep();
      }
    } catch (err) {
      log.error(err);
    } finally {
      setSaving(false);
    }
  };
  log.info('faqs: ', courseData.faqs);

  useEffect(() => {
    if (!courseData.faqs.length) {
      updateCourseData('faqs', [{ question: '', answer: '' }]);
    }
  }, []);

  if (!courseData._id) {
    toast.error('Please complete the course info section before proceeding.');
    goToStep(1);
  }
  return (
    <div className=" w-full">
      <div className="space-y-4">
        {courseData.faqs.map((faq, index) => (
          <div
            key={index}
            className="w-full border p-3 rounded-lg dark:border-gray-600"
            ref={scrollRef}
          >
            {/* FAQ Question */}
            <div className="flex gap-2 mb-2 items-start">
              <Input
                label={`Question ${index + 1}`}
                value={faq.question}
                onChange={(e) => {
                  const updatedFaqs = [...courseData.faqs];
                  updatedFaqs[index].question = e.target.value; // Update the specific FAQ question
                  updateCourseData('faqs', updatedFaqs);
                }}
                placeholder={`FAQ Question ${index + 1}`}
                className="flex-1"
              />
              <Tooltip content={`Remove FAQ ${index + 1}`} position="left">
                <Button
                  variant="danger"
                  className="p-2 mt-7 inline  "
                  onClick={() => handleRemoveFaq(index)}
                  disabled={
                    courseData.faqs.length === 1 || deletingFaq === faq._id
                  }
                >
                  {deletingFaq === faq._id ? <LoadingCircle /> : <Trash2 />}
                </Button>
              </Tooltip>
            </div>

            {/* FAQ Answer */}
            <Textarea
              label={`Answer to Question ${index + 1}`}
              value={faq.answer}
              onChange={(e) => {
                const updatedFaqs = [...courseData.faqs];
                updatedFaqs[index].answer = e.target.value; // Update the specific FAQ answer
                updateCourseData('faqs', updatedFaqs);
              }}
              placeholder={`Answer to FAQ ${index + 1}`}
              className="w-full"
            />
          </div>
        ))}

        {/* Add FAQ Button */}
        <Button variant="outline" className="gap-1 mt-4" onClick={handleAddFaq}>
          <Plus size={18} />
          ADD FAQ
        </Button>
      </div>

      {/* Save FAQs Button */}
      <Button
        variant="success"
        onClick={saveFaqs}
        disabled={saving}
        className="ml-auto"
      >
        <Save size={18} /> {saving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
};

export default CreateFaqs;
