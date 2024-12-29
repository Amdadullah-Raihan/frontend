import React, { useEffect, useState } from 'react';

import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Text from '../../../components/texts/Text';
import Button from '../../../components/buttons/Button';
import axiosInstance from '../../../api/axiosInstance';

const MyCourseCard = ({ course }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const handleContinueCourse = (id) => {
    navigate(`/courses/${id}`);
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/progress/video/${user.user._id}`
        );
        const responseData = response.data;

        if (responseData.videoProgress) {
          // Calculate progress
          const courseVideos = course.course.videos;
          const unlockedVideos = responseData.videoProgress.filter(
            (video) => video.courseId === course.course._id && video.unlocked
          );

          // Ensure only unique unlocked videos are counted
          const uniqueUnlockedVideos = [
            ...new Set(unlockedVideos.map((video) => video.videoId)),
          ];

          const totalVideos = courseVideos.length;
          const unlockedCount = uniqueUnlockedVideos.length;
          const progressPercentage = (unlockedCount / totalVideos) * 100;

          // Ensure progress doesn't exceed 100%
          const progressValue = Math.min(progressPercentage, 100);

          setProgress(progressValue.toFixed(2)); // Round to two decimal places
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, [user.user._id, course.course._id]);

  // progress numbers animation
  useEffect(() => {
    let start = 0;
    const duration = 500; // Duration of the animation in ms
    const increment = progress / (duration / 16); // 60 frames per second

    const animate = () => {
      start += increment;
      if (start < progress) {
        setAnimatedProgress(Math.round(start));
        requestAnimationFrame(animate);
      } else {
        setAnimatedProgress(progress);
      }
    };

    animate();
  }, [progress]);

  return (
    <div
      key={course?.course?._id}
      onClick={() => handleContinueCourse(course?.course?._id)}
      className="flex flex-col items-center justify-between gap-5 md:p-2 md:pl-[0.70rem] p-3 pt-[0.85rem] bg-white dark:bg-gray-800 rounded-lg shadow-xl cursor-pointer md:flex-row"
    >
      <div className="flex items-center justify-center w-full lg:w-[55%] overflow-hidden rounded-md ">
        <img
          src={`${course?.course?.thumbnailUrl}`}
          alt="thumbnails"
          className="h-56"
        />
      </div>
      <div className="w-full lg:w-[45%]">
        <Text variant="h4">{course.course.title}</Text>

        <div
          dangerouslySetInnerHTML={{ __html: course.course.description }}
          className="line-clamp-2 mt-2 opacity-70"
        />
        <div className="grid grid-cols-[5fr_1fr] items-center justify-between w-full gap-1  my-2">
          <div className="w-full h-2 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <Text variant="h6" className="w-12 text-center">
            {parseInt(animatedProgress)}%
          </Text>
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={() => handleContinueCourse(course?.course?._id)}
            disabled={progress === 100}
          >
            {progress === 100 ? 'Completed' : 'Continue Course'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyCourseCard;
