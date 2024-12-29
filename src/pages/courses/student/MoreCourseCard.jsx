// MoreCourseCard.jsx - component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/buttons/Button';
import Modal from '../../../components/Modal';
import Text from '../../../components/texts/Text';
import { useAuth } from '../../../context/AuthContext';
import ViewDetails from './ViewDetails';
import Payment from '../../payment/Payment';
import { Sparkle } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import log from '../../../utils/log';
import currencySymbols from '../../../utils/currencySymbols';

const MoreCourseCard = ({ course, isMyCourses }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // const nodeEnv = process.env.NODE_ENV;

  const [selectedCourse, setSelectedCourse] = useState({});
  const [open, setOpen] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleNavigation = () => {
    if (isMyCourses || user.user.role === 'admin') {
      navigate(`/courses/${course._id}`);
    }
  };

  log.info('course from more course card: ', course);

  const handleCourseEnroll = async (course) => {
    setOpen(false);
    setSelectedCourse(course);
    if (course.price > 0) {
      setOpenPayment(true);
    } else {
      try {
        const res = await axiosInstance.post('/api/myCourses', {
          username: user.user.username,
          email: user.user.email,
          courseId: course._id,
        });
        if (res.status === 200) {
          setIsEnrolled(true);
          toast.success('Course enrolled successfully!');
        }
      } catch (err) {
        console.error('Error enrolling free course', err);
      }
    }
  };

  if (!course) {
    return (
      <Text
        className="flex flex-col items-center justify-center w-full h-full p-4 transition-shadow duration-300 bg-white dark:bg-gray-800   rounded-lg shadow-md cursor-pointer text-rose-500 hover:shadow-lg"
        variant="h6"
      >
        No course found.
        <span className="text-primaryLight">This course might be deleted.</span>
      </Text>
    );
  }

  return (
    <div className="relative">
      {course.discount > 0 && (
        <Text className="bg-primary text-white px-2 py-1 absolute top-8  z-10 rounded-r-full font-medium text-sm">
          Save: {course.discount}%
        </Text>
      )}
      {course.price < 1 && (
        <Text className="bg-primary text-white px-2 py-1 absolute top-8  z-10 rounded-r-full font-medium text-sm flex gap-2 items-center">
          <Sparkle size={16} /> Free <Sparkle size={16} />
        </Text>
      )}
      <div
        className="flex flex-col justify-between h-full transition-shadow duration-300 bg-white dark:bg-gray-800  rounded-lg shadow-md cursor-pointer hover:shadow-lg"
        onClick={handleNavigation}
      >
        <div className="p-2 pb-0 ">
          <div
            className="h-48  bg-no-repeat bg-cover rounded-t-md"
            style={{
              backgroundImage: course.thumbnailUrl
                ? `url(${course.thumbnailUrl})`
                : 'none',
            }}
          >
            {course.thumbnailUrl ? null : <p>No image available</p>}
          </div>

          <div className="p-2 pb-0">
            <Text variant="h4" className="mb-3 line-clamp-1">
              {course.title}
            </Text>
            {/* <Text className="mb-3 text-gray-600 dark:text-gray-400 line-clamp-2">
              {course.description}
            </Text> */}
            <div dangerouslySetInnerHTML={{ __html: course.description }} />

            <div className="flex items-center justify-between mt-2 ">
              {!isMyCourses && (
                <Text>
                  {/* Price after discount */}
                  <span className="font-bold text-primary">
                    {currencySymbols[course.currency]}
                    {(
                      course.price -
                      (course.price * course.discount) / 100
                    ).toFixed(2)}{' '}
                  </span>

                  {/* Price before discount */}
                  {course.discount > 0 && (
                    <strike className="text-gray-500 dark:text-gray-400  text-sm  ">
                      {currencySymbols[course.currency]}
                      {course.price}
                    </strike>
                  )}
                </Text>
              )}
              {/* <Text className="text-gray-500 dark:text-gray-400  text-sm">
                Total {course.videos.length} Videos
              </Text> */}
            </div>
          </div>
        </div>

        {isMyCourses ? (
          <div className="flex justify-end p-4">
            <Button className="w-1/2">See Course</Button>
          </div>
        ) : (
          <div className="grid items-center justify-between grid-cols-2 gap-2 p-2 pt-4">
            {user.user.role !== 'admin' && (
              <Button
                variant="primary"
                onClick={() => handleCourseEnroll(course)}
                className="w-full text-[0.8rem]"
                disabled={isEnrolled}
              >
                Enroll Now
              </Button>
            )}
            <Button
              variant="secondary"
              className="text-[0.8rem]"
              onClick={() => {
                if (isEnrolled) {
                  navigate(`/courses/${course._id}`);
                } else {
                  setOpen(true);
                }
              }}
            >
              {isEnrolled ? 'See Course' : ' Course Details'}
            </Button>
          </div>
        )}

        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          className="w-full max-w-screen-md"
        >
          <ViewDetails
            course={course}
            actionButton={
              <div className="grid grid-cols-2 w-full gap-4 max-w-sm ml-auto">
                <Button variant="danger" onClick={() => setOpen(false)}>
                  Cancel
                </Button>

                {user.user.role !== 'admin' && (
                  <Button
                    variant="primary"
                    onClick={() => handleCourseEnroll(course)}
                  >
                    Enroll Now
                  </Button>
                )}
              </div>
            }
          />
        </Modal>
      </div>

      <Modal isOpen={openPayment} onClose={() => setOpenPayment(false)}>
        <Payment course={selectedCourse} setOpenPayment={setOpenPayment} />
      </Modal>
    </div>
  );
};
export default MoreCourseCard;
