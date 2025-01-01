// MoreCourses.jsx - Page
import React, { useEffect, useState } from 'react';

import MoreCourseCard from './MoreCourseCard';
import SkeletonMoreCourses from '../../../components/skeletons/SkeletonMoreCourses';
import { useAuth } from '../../../context/AuthContext';
import congratulationsSvg from '../../../assets/Congratulation.png';
import Text from '../../../components/texts/Text';
import axiosInstance from '../../../api/axiosInstance';
import useTitle from '../../../hooks/useTitle';
import Pagination from '../../../components/Pagination';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MoreCourses = () => {
  useTitle('Unenrolled Courses');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    setLoading(true);
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/courses/unenrolled/${user.email}?page=${currentPage}&limit=${limit}`
        );
        setCourses(response.data.unenrolledCourses);
        setTotalPages(response.data.totalCourses);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, limit]);

  if (loading) {
    return (
      <div>
        <SkeletonMoreCourses />
      </div>
    );
  }

  if (!courses.length) {
    navigate('/courses/my-courses');
    toast("You're enrolled in every courses we're offering!");
  }

  return (
    <div>
      {!courses.length ? (
        <div className="bg-white dark:bg-gray-800 w-full rounded-lg p-5  shadow">
          <img src={congratulationsSvg} className="lg:w-4/6 mx-auto" />
          <Text variant="h2" className="text-primary font-bold text-center">
            Congratulations!
          </Text>
          <Text className="text-center mt-2 text-lg text-gray-600 ">
            You&apos;re enrolled in every course <br /> we&apos;re offering.
          </Text>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <MoreCourseCard key={course._id} course={course} />
            ))}
          </div>
          <Pagination
            totalCount={totalPages}
            pageSize={limit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            limit={limit}
            setLimit={setLimit}
          />
        </>
      )}
    </div>
  );
};

export default MoreCourses;
