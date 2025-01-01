import React, { useEffect, useState } from 'react';
import { BookOpenText, UserRound } from 'lucide-react';

import Text from '../../../components/texts/Text';
import LoadingCircle from '../../../components/svgs/LoadingCircle';
import axiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';

const CircularProgress = ({ progress }) => {
  const { isDarkMode } = useSelector((state) => state.theme);

  // Local States
  const strokeWidth = 5;
  const radius = 45;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#F2F1F9"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        fill="transparent"
        stroke="#F79426"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: 'stroke-dashoffset 0.35s' }}
      />
      <text
        x="50%"
        y="50%"
        alignmentBaseline="middle"
        textAnchor="middle"
        fill={isDarkMode ? 'white' : '#4b5563'}
        fontSize="12"
      >
        {Number.isInteger(progress) ? progress : progress.toFixed(1)}%
      </text>
    </svg>
  );
};

const StudentsProgress = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Default filter option

  const calculateProgress = (completedCourseCount, enrolledCourseCount) => {
    if (enrolledCourseCount === 0) {
      return 0;
    }
    const progressPercentage =
      (completedCourseCount / enrolledCourseCount) * 100;
    return Math.min(progressPercentage, 100);
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchStudentsProgress = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/dashboard/courses/studentProgress`
        );
        setStudents(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentsProgress();
  }, []);

  useEffect(() => {
    const applyFilter = () => {
      if (filter === 'all') {
        setFilteredStudents(students);
      } else if (filter === 'enrolled') {
        setFilteredStudents(
          students.filter((student) => student.enrolledCourseCount > 0)
        );
      } else if (filter === 'notEnrolled') {
        setFilteredStudents(
          students.filter((student) => student.enrolledCourseCount === 0)
        );
      }
    };
    applyFilter();
  }, [filter, students]);

  if (isLoading) {
    return (
      <div className="py-10">
        <LoadingCircle />
      </div>
    );
  }

  return (
    <div className="transition-all duration-300 divide-y dark:divide-gray-700">
      <div className="flex items-center justify-between py-5 ">
        <Text variant="h4">Student&apos;s Progress</Text>
        <select
          className="p-2 text-sm transition-colors bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:outline-primary"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Students</option>
          <option value="enrolled">Enrolled Students</option>
          <option value="notEnrolled">Not Enrolled Students</option>
        </select>
      </div>
      {filteredStudents.map((student) => (
        <div
          key={student.email}
          className="flex items-center justify-between py-2 "
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-20 h-20 overflow-hidden border rounded-full dark:border-gray-600">
              {student.image ? (
                <img src={student.image} alt={student.username} />
              ) : (
                <UserRound size={32} className="text-gray-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <BookOpenText className="text-primary" size={16} />
                <Text className="text-gray-500">
                  <span>{student.completedCourseCount}</span>/
                  <span>{student.enrolledCourseCount} </span>
                </Text>
              </div>
              <Text className="text-sm font-medium">{student.username}</Text>
              <Text className="pr-2 text-xs text-gray-500 dark:text-gray-400 max-w-32 md:max-w-full line-clamp-1 text-ellipsis">
                {student.email}
              </Text>
            </div>
          </div>
          <div>
            <CircularProgress
              progress={calculateProgress(
                student.completedCourseCount,
                student.enrolledCourseCount
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentsProgress;
