import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import axiosInstance from '../api/axiosInstance';
import LoadingCircle from '../components/svgs/LoadingCircle';

const DashboardContext = createContext();

export const useDashboard = () => {
  return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [adminStats, setAdminStats] = useState({});
  const [userStats, setUserStats] = useState({});
  const [subtitles, setSubtitles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user || !user?.user) {
        return;
      }

      try {
        setLoading(true);
        if (user?.user?.role === 'admin') {
          const [
            adminStatsResponse,
            usersResponse,
            studentsResponse,
            coursesResponse,
            enrollmentResponse,
          ] = await Promise.all([
            axiosInstance.get(`/api/dashboard/admin`),
            axiosInstance.get(`/api/dashboard/users/newUsersIn30Days`),
            axiosInstance.get(`/api/dashboard/students/newStudentsIn30Days`),
            axiosInstance.get(`/api/dashboard/courses/newCoursesIn30Days`),
            axiosInstance.get(`/api/dashboard/courses/totalCourseEnrollmentIn30Days`),
          ]);
          setAdminStats(adminStatsResponse?.data);
          setSubtitles([
            `${usersResponse.data.usersAdded} new users (30 days)`,
            `${studentsResponse.data.studentsAdded} new students (30 days)`,
            `${coursesResponse.data.coursesAdded} new courses (30 days)`,
            `${enrollmentResponse.data.totalEnrollment} total enrollments (30 days)`,
          ]);
        } else {
          const userStatsResponse = await axiosInstance.get(
            `/api/dashboard/user?email=${user?.user?.email}`
          );
          setUserStats(userStatsResponse?.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  const value = useMemo(
    () => ({
      loading,
      adminStats,
      userStats,
      subtitles,
    }),
    [loading, adminStats, userStats, subtitles, user]
  );

  return (
    <DashboardContext.Provider value={value}>
      {!loading ? children :  <div className='h-screen w-full flex justify-center items-center bg-gray-200 dark:bg-gray-900'><LoadingCircle className="w-10 h-10" /></div>}
    </DashboardContext.Provider>
  );
};
