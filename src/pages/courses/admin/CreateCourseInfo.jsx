import React, { useEffect, useState } from 'react';
import { useCreateCourse } from '../../../context/CreateCourseContext';
import Input from '../../../components/inputs/Input';
import FileUpload from '../../../components/inputs/FileUpload';
import SelectInput from '../../../components/inputs/SelectInput';
import { CircleArrowUp, ImagePlus, Plus, Save, X } from 'lucide-react';
import axios from 'axios'; // For making API requests
import toast from 'react-hot-toast';
import Text from '../../../components/texts/Text';
import Button from '../../../components/buttons/Button';
import Modal from '../../../components/Modal';
import RichEditor from '../../../components/inputs/RichEditor';
import axiosInstance from '../../../api/axiosInstance';
import log from '../../../utils/log';
import { cn } from '../../../utils/cn';
// import log from '../../../utils/log';

const categoryOptions = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'new', label: 'Add a new Category' },
];

const levelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const CourseInfo = () => {
  const { courseData, updateCourseData, nextStep } = useCreateCourse();
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [categories, setCategories] = useState(categoryOptions);
  const [newCategory, setNewCategory] = useState('');
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    level: '',
    language: '',
    tags: '',
  });
  const [saving, setSaving] = useState(false);

  const [languageOptions, setLanguageOptions] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

  log.info('course data from coure info: ', courseData);
  const addTag = (e) => {
    if (!e.target.value) return; //
    if (tags.includes(e.target.value.trim())) {
      toast.error('This tag is already included.');
      setInputValue('');
      return;
    }
    setTags((prev) => [...prev, inputValue.trim()]);
    setInputValue('');
  };

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeydown = (e) => {
    if (e.key === 'Enter') {
      addTag(e);
    }
    if (!e.target.value && e.key === 'Backspace') {
      setTags((prev) => prev.filter((_, i) => i !== tags.length - 1));
    }
  };

  const addCatergory = () => {
    if (!newCategory) {
      toast.error('Please enter a category.');
      return;
    }

    if (
      categories.some(
        (category) => category.value === newCategory.toLowerCase().trim()
      )
    ) {
      toast.error('This category is already included.');
      return;
    }

    const updatedCategory = {
      value: newCategory.toLowerCase(),
      label: newCategory,
    };

    setCategories((prev) => {
      const newCategories = [...prev];
      newCategories.splice(newCategories.length - 1, 0, updatedCategory); // Insert before the last item
      return newCategories;
    });

    updateCourseData('category', newCategory.toLowerCase());

    setNewCategory('');
  };

  const validate = () => {
    const newErrors = {};

    // Validate title
    if (!courseData.title) {
      newErrors.title = 'Please provide a title for your course.';
    }

    // Validate thumbnail
    if (!courseData.thumbnail && !courseData.thumbnailUrl) {
      newErrors.thumbnail =
        'A thumbnail image helps attract learners. Please upload one.';
    }

    // Validate description
    if (!courseData.description) {
      newErrors.description =
        'A detailed description is essential to explain the course content. Please add one.';
    }

    // Validate category
    if (!courseData.category) {
      newErrors.category =
        'Please select a category that best describes your course.';
    }

    // Validate level
    if (!courseData.level) {
      newErrors.level =
        'Indicate the difficulty level of your course (e.g., Beginner, Intermediate, Advanced).';
    }

    // Validate language
    if (!courseData.language) {
      newErrors.language =
        'Select the language in which the course is delivered.';
    }

    // Validate tags
    if (courseData.tags.length === 0) {
      newErrors.tags =
        'Add at least one relevant tag to help learners find your course.';
    }

    // If there are errors, set them and return false, otherwise return true
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const saveCourseInfo = async () => {
    const isValidated = validate();
    if (!isValidated) {
      toast.error('Please fill all the required fields.');
      return;
    }

    // Create form data for sending files such as images, videos etc.
    const formData = new FormData();
    formData.append('_id', courseData._id.trim());
    formData.append('title', courseData.title.trim());
    formData.append('description', courseData.description.trim());
    formData.append('category', courseData.category);
    formData.append('level', courseData.level);
    formData.append('language', courseData.language);
    formData.append('tags', JSON.stringify(courseData.tags));
    formData.append('thumbnail', courseData.thumbnail);

    try {
      setSaving(true);
      const savedCourse = await axiosInstance.post(
        '/api/courses/create/info',
        formData
      );

      // Log the full response to verify its structure
      log.info('API Response:', savedCourse);

      if (savedCourse.status >= 200 && savedCourse.status < 300) {
        toast.success('Course Info Saved.');

        const courseId = savedCourse.data.course?._id; // Use optional chaining to avoid undefined error
        if (courseId) {
          // Save to localStorage and update context only if courseId exists
          localStorage.setItem('savedCourse', courseId);
          updateCourseData('_id', courseId); // Update course ID in context
          log.success('Course created successfully:', savedCourse);
        } else {
          toast.error('Course ID not found in response.');
        }

        nextStep();
      } else {
        toast.error(
          `Failed to save course. Status code: ${savedCourse.status}`
        );
      }
    } catch (err) {
      log.error('Error Saving Course Info:', err);
      toast.error(
        err.response?.data?.message ||
          'An error occurred while saving the course.'
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // Fetch languages from API
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const languagesSet = new Set();

        response.data.forEach((country) => {
          const languages = country.languages;
          if (languages) {
            Object.values(languages).forEach((language) => {
              languagesSet.add(language);
            });
          }
        });

        // Convert Set to array and map to options
        const languagesArray = Array.from(languagesSet).map((language) => ({
          value: language.toLowerCase(),
          label: language,
        }));

        setLanguageOptions(languagesArray);
      } catch (error) {
        console.error('Error fetching languages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    updateCourseData('tags', tags);
  }, [tags]);

  // log.info('quiz description', courseData.description);

  return (
    <div className=" w-full border dark:border-gray-600 rounded-lg p-5">
      {/* Title */}
      <div className="mb-4">
        <Input
          type="text"
          label="Course title"
          value={courseData.title}
          error={errors.title}
          onChange={(e) => updateCourseData('title', e.target.value)}
          placeholder="Enter course title"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <Text className="mb-1 font-medium">Course Description</Text>
        <div
          className={errors.description && 'border border-red-500 rounded-lg'}
        >
          <RichEditor
            value={courseData.description}
            onChange={(content) => updateCourseData('description', content)} // Use content directly
            placeholder="Write and format the course's description..."
          />
        </div>
        {errors.description && (
          <Text className="text-red-500 text-sm italic">
            {errors.description}
          </Text>
        )}
      </div>

      {/* Thumbnail */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-white font-medium mb-1">
          Course Thumbnail
        </label>

        <div className="max-h-52 rounded-lg overflow-hidden">
          <FileUpload
            accept="image/*"
            icon={ImagePlus}
            label={courseData._id ? 'Update the Image' : 'Choose an Image'}
            error={errors.thumbnail}
            handleFileChange={(e) =>
              updateCourseData('thumbnail', e.target.files[0])
            }
          />
          {/* <img src={courseData.thumbnailUrl} className="rounded-lg" /> */}
        </div>
      </div>

      {/* Category */}
      <div className="mb-4">
        <SelectInput
          label="Category"
          placeholder="Select a Category"
          value={courseData.category}
          error={errors.category}
          onChange={(e) => updateCourseData('category', e.target.value)}
          options={categories}
          className="mb-4"
        />

        <Modal
          isOpen={courseData.category === 'new'}
          onClose={() => updateCourseData('category', '')}
        >
          <div className="w-full p-5">
            <Input
              type="text"
              label="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category"
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button
                variant="secondary"
                className=""
                onClick={() => updateCourseData('category', '')}
              >
                Cancel
              </Button>
              <Button onClick={addCatergory} className="gap-1">
                <Plus size={18} /> Add Category
              </Button>
            </div>
          </div>
        </Modal>
      </div>

      {/* Level */}
      <div className="mb-4">
        <SelectInput
          label="Level"
          placeholder="Select a Level"
          value={courseData.level}
          error={errors.level}
          onChange={(e) => updateCourseData('level', e.target.value)}
          options={levelOptions}
        />
      </div>

      {/* Language */}
      <div className="mb-4">
        {loading ? (
          <div className="flex items-center justify-center">
            <span>Loading languages...</span>
          </div>
        ) : (
          <SelectInput
            label="Language"
            placeholder="Select a Language"
            value={courseData.language}
            error={errors.language}
            onChange={(e) => updateCourseData('language', e.target.value)}
            options={languageOptions}
          />
        )}
      </div>

      {/* Tags */}
      <>
        <Text className="mb-1 font-medium">Tags</Text>
        <div
          className={cn(
            ' border border-gray-300 dark:border-gray-600 rounded-lg flex flex-wrap items-center overflow-hidden',
            errors.tags && 'border-red-500 dark:border-red-500'
          )}
        >
          {courseData?.tags?.length > 0 && (
            <div className="  dark:bg-gray-800 p-2 flex gap-2 flex-wrap">
              {courseData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="relative inline-block px-2 py-1 text-sm font-medium text-gray-800 dark:text-white bg-background p-1 dark:bg-gray-700 rounded group"
                >
                  <div
                    onClick={() => removeTag(index)}
                    className="absolute -right-2 -top-2 bg-rose-500  rounded-full z-10 p-[0.1rem] hidden group-hover:flex items-center justify-center text-white"
                  >
                    <X size={12} className="cursor-pointer" />
                  </div>
                  {tag}
                </div>
              ))}
            </div>
          )}
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeydown}
            className="border-none w-full h-6 m-2 px-0 focus:ring-0"
            placeholder="Enter a tag & press enter"
          />
        </div>
        {errors.tags && (
          <Text className="text-red-500 text-sm italic">{errors.tags}</Text>
        )}
      </>
      <Button
        variant="success"
        disabled={saving}
        onClick={saveCourseInfo}
        className={'ml-auto mt-4'}
      >
        {courseData._id ? <CircleArrowUp size={18} /> : <Save size={18} />}
        {saving ? 'Saving...' : courseData._id ? 'Update' : 'Save'}
      </Button>
    </div>
  );
};

export default CourseInfo;
