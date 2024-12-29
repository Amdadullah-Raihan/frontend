import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import LessonsList from './LessonsList';
import VideoPlayer from './VideoPlayer';
import Button from '../../../components/buttons/Button';
import Text from '../../../components/texts/Text';
import { useAuth } from '../../../context/AuthContext';
import CourseDescription from './CourseDescription';
import CourseIntroduction from './CourseIntroduction';
import SkeletonCourseDetails from '../../../components/skeletons/SkeletonCourseDetails';
import axiosInstance from '../../../api/axiosInstance';
import useTitle from '../../../hooks/useTitle';
import { ChevronDown, File, FileText, Play } from 'lucide-react';
import log from '../../../utils/log';
import DisplayPdf from './DisplayPdf';
import DisplayArticle from './DisplayArticle';
import Quiz from './QuizPage';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const videoPlayerRef = useRef(null);
  const lessonsListRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockedVideos, setUnlockedVideos] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);

  useTitle(course ? course.title : 'Course');
  // Function to handle previous video
  const handlePrevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Function to unlock a video from the backend
  const unlockVideo = async (nextIndex, nextVideo, courseId) => {
    try {
      // Send request to backend to unlock the next video
      const response = await axiosInstance.post(`/api/courses/video/unlock`, {
        userId: user.user._id,
        courseId,
        nextVideoId: nextVideo._id,
      });
      if (response.status === 200) {
        // Fetch updated course data after unlocking
        await fetchCourseData();
        setCurrentIndex(nextIndex); // Update the index after fetching updated data
        localStorage.setItem(`course_${courseId}_currentIndex`, nextIndex); // Save index to local storage
      } else {
        console.error('Error unlocking next video:', response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error(
        'Error unlocking next video:',
        error.response?.data?.message || error.message
      );
    } finally {
      setUnlocking(false);
    }
  };

  // Function to handle next video
  const handleNextVideo = () => {
    setUnlocking(true);
    const nextIndex = currentIndex + 1;
    if (nextIndex >= course.videos.length) {
      return;
    }

    const nextVideo = course.videos[nextIndex];

    // Check if the next video is unlocked
    if (nextVideo.isUnlocked) {
      setCurrentIndex(nextIndex);
      setUnlocking(false);
      return;
    }
    unlockVideo(nextIndex, nextVideo, course._id);
  };

  // Function to fetch course data
  const fetchCourseData = async () => {
    try {
      const response = await axiosInstance.post(`/api/courses/${id}`, {
        userId: user.user._id,
      });
      setCourse(response.data);

      // Retrieve the saved index from local storage
      const savedIndex = localStorage.getItem(
        `course_${response.data._id}_currentIndex`
      );
      setCurrentIndex(savedIndex ? parseInt(savedIndex, 10) : 0);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching course data:', error);
      setLoading(false);
    }
  };

  // Effect to fetch course data when component mounts or course ID changes
  useEffect(() => {
    fetchCourseData();
  }, [id]);

  // Effect for setting course progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/progress/video/${user.user._id}`
        );
        const responseData = response.data;

        if (responseData.videoProgress) {
          // Calculate progress
          const courseVideos = course?.videos;
          const unlockedVideos = responseData.videoProgress.filter(
            (video) => video.courseId === course?._id && video.unlocked
          );

          // Ensure only unique unlocked videos are counted
          const uniqueUnlockedVideos = [
            ...new Set(unlockedVideos.map((video) => video.videoId)),
          ];

          const totalVideos = courseVideos?.length;
          const unlockedCount = uniqueUnlockedVideos.length;
          const progressPercentage = (unlockedCount / totalVideos) * 100;

          // Ensure progress doesn't exceed 100%
          const progressValue = Math.min(progressPercentage, 100);
          setUnlockedVideos(unlockedCount);
          setTotalVideos(totalVideos);
          setProgress(progressValue.toFixed(2)); // Round to two decimal places
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, [course, user.user._id]);

  // Effect to synchronize the height of the LessonsList with VideoPlayer
  useEffect(() => {
    if (videoPlayerRef.current && lessonsListRef.current) {
      const videoPlayerHeight = videoPlayerRef.current.clientHeight;
      lessonsListRef.current.style.height = `${videoPlayerHeight}px`;
    }
  }, [course, currentIndex]);

  // Effect to save currentIndex to local storage whenever it changes
  useEffect(() => {
    if (course) {
      localStorage.setItem(`course_${course._id}_currentIndex`, currentIndex);
    }
  }, [currentIndex, course]);

  // Show loading skeleton while data is loading
  if (loading) {
    return (
      <div>
        <SkeletonCourseDetails />
      </div>
    );
  }
  if (!course) {
    return <Text>Course not found!</Text>;
  }
  return (
    <div className="space-y-4 max-w-screen-xl mx-auto">
      {/* Course introduction */}
      <CourseIntroduction course={course} />

      <div className="flex flex-col lg:flex-row  gap-4">
        {/* Left side player */}
        <div
          className="rounded-lg border bg-white p-2 md:p-4 w-full space-y-2 dark:bg-gray-800 dark:border-gray-800 "
          ref={videoPlayerRef}
        >
          {selectedLesson ? (
            selectedLesson.type === 'pdf' ? (
              <DisplayPdf pdfUrl={selectedLesson.content} />
            ) : selectedLesson.type === 'article' ? (
              <DisplayArticle content={selectedLesson.content} />
            ) : selectedLesson.type === 'video' ? (
              <VideoPlayer
                src={selectedLesson.content}
                title={selectedLesson.title}
                userId={user.user._id}
              />
            ) : (
              <Quiz quiz={selectedLesson} />
            )
          ) : (
            <div>No lesson selected.</div>
          )}

          {/* <VideoPlayer
            src={course?.videos[currentIndex].url}
            title={course?.videos[currentIndex].title}
            userId={user.user._id}
            courseId={course?._id}
            videoId={course?.videos[currentIndex]._id}
          /> */}
          <div className="md:flex justify-between space-y-2 md:space-y-0 ">
            {/* <Text className="text-xs sm:text-sm font-medium">
              {currentIndex + 1}. {course?.videos[currentIndex].title}{' '}
            </Text> */}
            {/* <div className="grid grid-cols-2 gap-2 ">
              <Button
                variant="secondary"
                onClick={handlePrevVideo}
                disabled={currentIndex === 0}
                className="dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Previous
              </Button>
              <Button
                onClick={handleNextVideo}
                disabled={
                  currentIndex === course.videos.length - 1 || unlocking
                }
              >
                {unlocking ? 'Unlocking...' : 'Next'}
              </Button>
            </div> */}
          </div>
        </div>

        {/* Right Side List */}
        <div
          ref={lessonsListRef}
          className="min-h-96 rounded-lg border bg-white  w-full lg:max-w-[19rem] overflow-y-auto dark:bg-gray-800 dark:border-gray-800"
        >
          <div className="h-4"></div>
          <div className="px-4 pb-4">
            <LessonsList
              course={course}
              selectedLesson={selectedLesson}
              selectedModule={selectedModule}
              setSelectedLesson={setSelectedLesson}
              setSelectedModule={setSelectedModule}

              // currentIndex={currentIndex}
              // setCurrentIndex={setCurrentIndex}
              // unlockedVideos={unlockedVideos}
              // totalVideos={totalVideos}
              // progress={progress}
              // userId={user.user._id}
              // hasCompletedQuiz={hasCompletedQuiz}
              // setHasCompletedQuiz={setHasCompletedQuiz}
            />
          </div>
          <div className="h-4"></div>
        </div>
      </div>

      {/* Course Description */}

      <CourseDescription course={course} />
    </div>
  );
};

export default CourseDetails;
