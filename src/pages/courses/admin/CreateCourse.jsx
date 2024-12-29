import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { Plus, Trash2 } from 'lucide-react';
import Button from '../../../components/buttons/Button';
import Input from '../../../components/inputs/Input';
import Modal from '../../../components/Modal';
import Text from '../../../components/texts/Text';
import Tooltip from '../../../components/Tooltip';
import axiosInstance from '../../../api/axiosInstance';
import useTitle from '../../../hooks/useTitle';
// import CreateQuiz from '../../quiz/admin/CreateQuiz';
// import UploadPdf from './UploadPdf';
// import DisplayPdf from '../DisplayPdf';

const CreateCourse = () => {
  useTitle('Create Course');
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: 0,
    discount: 0,
    thumbnail: null,
    videos: [],
  });
  const [videoFields, setVideoFields] = useState([{ video: null, title: '' }]);
  const [videoUrlFields, setVideoUrlFields] = useState([
    { url: '', title: '' },
  ]);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const [isAddUrlButtonDisabled, setIsAddUrlButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('file'); // Add state for tab selection
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const [quizData, setQuizData] = useState({
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        answer: '',
      },
    ],
  });

  const areAllVideosFilled = () => {
    return videoFields.every(
      (videoField) => videoField.video && videoField.title.trim() !== ''
    );
  };

  const areAllVideoUrlsFilled = () => {
    return videoUrlFields.every(
      (videoUrlField) =>
        videoUrlField.url.trim() !== '' && videoUrlField.title.trim() !== ''
    );
  };

  const handleVideoFileChange = (index, file) => {
    const newVideoFields = [...videoFields];
    newVideoFields[index].video = file;
    setVideoFields(newVideoFields);
    setIsAddButtonDisabled(!areAllVideosFilled());
  };

  const handleVideoTitleFieldChange = (index, value) => {
    const newVideoFields = [...videoFields];
    newVideoFields[index].title = value;
    setVideoFields(newVideoFields);
    setIsAddButtonDisabled(!areAllVideosFilled());
  };

  const handleVideoUrlChange = (index, value) => {
    const newVideoUrlFields = [...videoUrlFields];
    newVideoUrlFields[index].url = value;
    setVideoUrlFields(newVideoUrlFields);
    setIsAddUrlButtonDisabled(!areAllVideoUrlsFilled());
  };

  const handleVideoUrlTitleChange = (index, value) => {
    const newVideoUrlFields = [...videoUrlFields];
    newVideoUrlFields[index].title = value;
    setVideoUrlFields(newVideoUrlFields);
    setIsAddUrlButtonDisabled(!areAllVideoUrlsFilled());
  };

  const handleAddVideoField = () => {
    setVideoFields([...videoFields, { video: null, title: '' }]);
    setIsAddButtonDisabled(true);
  };

  const handleAddVideoUrlField = () => {
    setVideoUrlFields([...videoUrlFields, { url: '', title: '' }]);
    setIsAddUrlButtonDisabled(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    setCourseData((prevState) => ({
      ...prevState,
      thumbnail: file,
    }));
  };

  const handleFaqQuestionChange = (index, value) => {
    const newFaqs = [...faqs];
    newFaqs[index].question = value;
    setFaqs(newFaqs);
  };

  const handleFaqAnswerChange = (index, value) => {
    const newFaqs = [...faqs];
    newFaqs[index].answer = value;
    setFaqs(newFaqs);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index) => {
    const newFaqs = [...faqs];
    newFaqs.splice(index, 1);
    setFaqs(newFaqs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('price', courseData.price);
    formData.append('discount', courseData.discount);
    formData.append('thumbnail', courseData.thumbnail);

    // Track the indexes of titles separately for videos and URLs
    let videoIndex = 0;
    let urlIndex = 0;

    videoFields.forEach((videoField) => {
      if (videoField.video) {
        formData.append('videos', videoField.video);
        formData.append(`videoTitles[${videoIndex}]`, videoField.title);
        videoIndex++;
      }
    });

    videoUrlFields.forEach((videoUrlField) => {
      if (videoUrlField.url.trim() !== '') {
        formData.append(`videoUrls[${urlIndex}]`, videoUrlField.url);
        formData.append(
          `videoTitles[${urlIndex + videoIndex}]`,
          videoUrlField.title
        );
        urlIndex++;
      }
    });

    // Format FAQs as an array of objects
    const formattedFaqs = faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));

    // Append FAQs to form data
    formData.append('faqs', JSON.stringify(formattedFaqs));

    // Append quiz data to formData, if available
    if (quizData && quizData.questions && quizData.questions.length > 0) {
      formData.append('quiz', JSON.stringify(quizData));
    }

    try {
      const response = await axiosInstance.post(`/api/courses`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setCreatedCourse(response.data);
      toast.success('Course created successfully!');
      setCourseData({
        title: '',
        description: '',
        price: 0,
        discount: 0,
        thumbnail: null,
        videos: [],
      });
      setVideoFields([{ video: null, title: '' }]);
      setVideoUrlFields([{ url: '', title: '' }]);
      setLoading(false);
      setShowModal(true);
    } catch (error) {
      setLoading(false);
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    }
  };

  const handleSeeDetails = () => {
    if (createdCourse) {
      navigate(`/courses/${createdCourse._id}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // console.log('Course Data: ', courseData);
  // console.log('Price: ', courseData.price);
  // console.log('Discount: ', courseData.discount);

  return (
    <div className="relative w-full max-w-screen-sm p-4 text-gray-900 bg-white dark:bg-gray-800   rounded-xl shadow-[0_0_5px_rgba(0,0,0,0.1)] dark:text-white">
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center font-bold bg-black bg-opacity-75 ">
          <Text variant="h5" className="flex gap-2 text-center text-white">
            Creating Course . . .
          </Text>
          <Text className="font-medium text-white font-xs">
            Uploading videos may take some time
          </Text>
        </div>
      )}

      <h1 className="mb-4 text-2xl font-bold">Create a New Course</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            Course <span className="text-primary">Title</span>
          </label>
          <Input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Exp. Web Development, JavaScript, React, Node.js..."
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            Course <span className="text-primary">Description</span>
          </label>
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-primary dark:bg-gray-700 dark:border-none"
            rows="3"
            placeholder="Exp. This is the only course you need to become a full-stack web application developer..."
            required
          ></textarea>
        </div>
        <div className=" grid md:grid-cols-2 gap-4">
          <div className="">
            <label className="block mb-1 text-sm font-medium">Price</label>
            <Input
              type="number"
              name="price"
              className="text-sm"
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                handleChange({
                  target: {
                    name: e.target.name,
                    value: value < 0 || !value ? 0 : value, // Set to 0 if the value is negative
                  },
                });
              }}
              placeholder="Enter '0' if your course is free"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              Discount (In <span className="text-rose-400">Percentage</span>)
            </label>
            <Input
              type="number"
              name="discount"
              className="text-sm"
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                handleChange({
                  target: {
                    name: e.target.name,
                    value: value < 0 || !value ? 0 : value, // Set to 0 if the value is negative
                  },
                });
              }}
              placeholder="Enter '0' if you don't have any discount"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium w-full">
            Thumbnail Image
          </label>
          <input
            type="file"
            name="thumbnail"
            onChange={handleThumbnailUpload}
            accept="image/*"
            className="w-full py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 file:border-none file:rounded-full file:bg-gray-900 file:p-2 file:text-white sm:text-sm bg-background  dark:bg-gray-700 px-2"
            required
          />
        </div>

        {/* Tab navigation */}
        <div className="mb-4">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleTabChange('file')}
              className={`py-2 px-4 ${activeTab === 'file' ? 'border-b-2 border-primary' : ''}`}
            >
              Upload Video
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('url')}
              className={`py-2 px-4 ${activeTab === 'url' ? 'border-b-2 border-primary' : ''}`}
            >
              Video URL
            </button>
          </div>
          {activeTab === 'file' && (
            <div>
              {videoFields.map((videoField, index) => (
                <div key={index} className="mt-2">
                  <label className="block mb-1 text-sm font-medium">
                    Video {index + 1}
                  </label>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <Input
                      type="text"
                      value={videoField.title}
                      onChange={(e) =>
                        handleVideoTitleFieldChange(index, e.target.value)
                      }
                      className="block w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder={`Video ${index + 1} Title`}
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        handleVideoFileChange(index, e.target.files[0])
                      }
                      accept="video/*"
                      className="w-full px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 file:border-none file:rounded-full file:bg-gray-900 file:p-2 file:text-white sm:text-sm"
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                type="button"
                onClick={handleAddVideoField}
                className={`mt-2 uppercase flex items-center ${isAddButtonDisabled ? 'opacity-50 cursor-not-allowed ' : ''}`}
                disabled={isAddButtonDisabled}
              >
                <Plus /> Add More Videos
              </Button>
            </div>
          )}
          {activeTab === 'url' && (
            <div>
              {videoUrlFields.map((videoUrlField, index) => (
                <div key={index} className="mt-2">
                  <label className="block mb-1 text-sm font-medium">
                    Video URL {index + 1}
                  </label>
                  <div className="grid items-center justify-center grid-cols-1 gap-2 md:grid-cols-2">
                    <Input
                      type="text"
                      value={videoUrlField.title}
                      onChange={(e) =>
                        handleVideoUrlTitleChange(index, e.target.value)
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder={`Video URL ${index + 1} Title`}
                    />
                    <Input
                      type="text"
                      value={videoUrlField.url}
                      onChange={(e) =>
                        handleVideoUrlChange(index, e.target.value)
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder={`Video URL ${index + 1}`}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                type="button"
                onClick={handleAddVideoUrlField}
                className={`mt-2 uppercase flex items-center disabled:opacity-50 disabled:border-gray-500 disabled:bg-gray-300 `}
                disabled={isAddUrlButtonDisabled}
              >
                <Plus /> Add More Video URLs
              </Button>
            </div>
          )}
        </div>
        {/* FAQ Section */}
        <div className="mb-4">
          <h2 className="mb-2 text-lg font-semibold">FAQs</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-2">
              <div className="flex items-center justify-between">
                <Input
                  type="text"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqQuestionChange(index, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder={`FAQ ${index + 1} Question`}
                />
                <Tooltip content="Delete FAQ" position="left">
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveFaq(index)}
                    className="w-11 h-10 p-0"
                  >
                    <Trash2 size={20} />
                  </Button>
                </Tooltip>
              </div>
              <textarea
                value={faq.answer}
                onChange={(e) => handleFaqAnswerChange(index, e.target.value)}
                className="block w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-primary dark:bg-gray-700 dark:border-none "
                rows="2"
                placeholder={`Answer to FAQ ${index + 1}`}
              />
            </div>
          ))}
          <Button
            variant="outline"
            type="button"
            onClick={handleAddFaq}
            className="flex items-center uppercase"
          >
            <Plus /> Add FAQ
          </Button>
        </div>
        {/* <CreateQuiz quizData={quizData} setQuizData={setQuizData} />
        <UploadPdf />
        <DisplayPdf /> */}
        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-1/3">
            <Plus />
            Create Course
          </Button>
        </div>
      </form>
      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <div className="space-y-16 relative z-[300] p-5">
          <Text variant="h6">
            Do you want to see the details about the course you just created?
          </Text>
          <div className="flex justify-end space-x-4 text-right">
            <Button variant="outline" onClick={handleCloseModal}>
              Create Another Course
            </Button>
            <Button onClick={handleSeeDetails}>See Details</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateCourse;
