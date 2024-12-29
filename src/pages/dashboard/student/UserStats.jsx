import {
  BookOpenCheck,
  CircleCheckBig,
  Clapperboard,
  UserCog,
} from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/buttons/Button';
import Text from '../../../components/texts/Text';
import LearningReport from './LearningReport';
import axiosInstance from '../../../api/axiosInstance';

const statItems = [
  {
    icon: UserCog,
    color: 'darkcyan',
    label: 'Account Status',
    value: 'accountStatus',
    conditionalClass: true,
  },
  {
    icon: Clapperboard,
    color: 'violet',
    label: 'Enrolled Course',
    value: 'numberOfEnrolledCourses',
  },
  {
    icon: BookOpenCheck,
    color: 'green',
    label: 'Completed Course',
    value: 'myCertificates',
  },
  {
    icon: CircleCheckBig,
    color: 'darkcyan',
    label: 'Course Completation Rate',
    value: 'courseCompletionRate',
    isPercentage: true,
  },
];

const courseItems = [
  {
    type: 'popularCourse',
    order: 'order-2 lg:order-3',
  },
  {
    type: 'recommendedCourse',
    order: 'order-4 lg:order-4',
  },
];

const StatCard = ({
  icon: Icon,
  label,
  value,
  conditionalClass,
  userInfo,
  isPercentage,
}) => (
  <div className="flex flex-col justify-between w-full gap-5 p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow h-36">
    <Icon className="text-gray-500 dark:text-gray-400" />
    <div className="space-y-2 text-start">
      <Text
        className={` capitalize text-xl font-medium ${
          conditionalClass && userInfo?.accountStatus === 'active'
            ? 'text-green-500'
            : conditionalClass && userInfo?.accountStatus === 'pending'
              ? 'text-primary'
              : conditionalClass && userInfo?.accountStatus === 'suspend'
                ? 'text-rose-500'
                : ''
        }`}
      >
        {isPercentage
          ? `${userInfo[value]?.toFixed(2)}%`
          : userInfo[value]?.toString()?.padStart(2, '0')}
      </Text>
      <Text className="text-gray-500 dark:text-gray-400">{label}</Text>
    </div>
  </div>
);

const CourseCard = ({ course, handleCourseEnroll, loading, className }) => (
  <div
    className={`flex flex-col justify-between transition-shadow duration-300 bg-white dark:bg-gray-800 rounded-lg shadow shadowcursor-pointer hover:shadow-lg ${className}`}
  >
    <img
      src={course?.banner}
      alt="banner"
      className="object-cover w-full h-40 rounded-t-md"
    />
    <div className="p-4">
      <Text
        variant="h2"
        className="mb-2 text-xl font-bold capitalize line-clamp-1"
      >
        {course?.title}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-ellipsis line-clamp-2">
        {course?.description}
      </Text>
    </div>
    <div className="flex justify-end p-4 pt-0">
      <Button
        variant="primary"
        onClick={() => handleCourseEnroll(course?._id)}
        className="w-full"
        loading={loading}
        disabled={course?.isEnrolled}
      >
        {course?.isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
      </Button>
    </div>
  </div>
);

const UserStats = ({ userInfo, user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCourseEnroll = async (id) => {
    setLoading(true);
    const data = {
      courseId: id,
      username: user?.user?.username,
      email: user?.user?.email,
    };
    try {
      const response = await axiosInstance.post(`/api/myCourses`, data);
      if (response) {
        toast.success('Course Enrolled successfully!');
        navigate('/courses');
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Course Enroll failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map(
          ({ icon, color, label, value, conditionalClass, isPercentage }) => (
            <StatCard
              key={label}
              icon={icon}
              color={color}
              label={label}
              value={value}
              conditionalClass={conditionalClass}
              userInfo={userInfo}
              isPercentage={isPercentage}
            />
          )
        )}
      </div>
      <LearningReport />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Text variant="h4" className="order-1">
          Popular Course
        </Text>
        <Text variant="h4" className="order-3 lg:order-2">
          Recommended Course
        </Text>

        {courseItems.map(({ type, order }) => (
          <CourseCard
            key={type}
            course={userInfo[type]}
            handleCourseEnroll={handleCourseEnroll}
            loading={loading}
            className={order}
          />
        ))}
      </div>
    </div>
  );
};

export default UserStats;
