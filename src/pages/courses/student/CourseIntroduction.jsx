import React from 'react';
import Text from '../../../components/texts/Text';
import Button from '../../../components/buttons/Button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseIntroduction = ({ course }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border rounded-lg  p-3 dark:bg-gray-800 dark:border-gray-800">
      <div className="flex justify-between ">
        <Text variant="h4" className="flex items-center">
          {course.title}
        </Text>
        <Button
          className="hidden gap-1 font-medium text-gray-900 bg-gray-200 md:flex hover:bg-gray-400 dark:bg-gray-700 dark:text-white"
          onClick={() => navigate('/courses')}
        >
          <ChevronLeft size={18} />
          Go Back
        </Button>
      </div>
      {/* <img
        src={course.thumbnailUrl}
        alt={course.title}
        className="object-cover w-full mb-8 rounded-lg h-60"
      /> */}
    </div>
  );
};

export default CourseIntroduction;
