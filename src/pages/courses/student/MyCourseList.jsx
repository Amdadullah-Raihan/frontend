import React, { useEffect, useState } from 'react';

import { useAuth } from '../../../context/AuthContext';
import MyCourseCard from './MyCourseCard';
import SkeletonMyCourses from '../../../components/skeletons/SkeletonMyCourses';
import axiosInstance from '../../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useTitle from '../../../hooks/useTitle';
import Pagination from '../../../components/Pagination';

const MyCourseList = () => {
  useTitle('Enrolled Courses');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setLoading(true);

    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/myCourses?email=${user.email}&page=${currentPage}&limit=${limit}`
        );
        setCourses(response.data.courses);
        setTotalPages(response.data.totalCourses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        // Optionally, you can set an error state to display an error message in the UI
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    // Cleanup function (optional but good practice)
    return () => {
      setLoading(false); // Ensures loading stops if the component unmounts
    };
  }, [user.email, currentPage, limit]);

  if (loading) {
    return (
      <div>
        <SkeletonMyCourses />
      </div>
    );
  }

  if (!courses.length) {
    navigate('/courses/more-courses');
    toast.error("You're not enrolled in any courses.");
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 ">
        {courses.map((course) => (
          <MyCourseCard
            key={course._id}
            course={course}
            setLoading={setLoading}
          />
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
    </div>
  );
};

export default MyCourseList;
