import {
  ChevronDown,
  File,
  FileText,
  LockKeyhole,
  Play,
  Search,
  Trophy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import QuizPage from './QuizPage';

import Text from '../../../components/texts/Text';
import Input from '../../../components/inputs/Input';
import LoadingCircle from '../../../components/svgs/LoadingCircle';
import SeeCertificateButton from './SeeCertificateButton';
import { useState } from 'react';
import { cn } from '../../../utils/cn';
import Modal from '../../../components/Modal';
import Button from '../../../components/buttons/Button';
import log from '../../../utils/log';

const LessonsList = ({
  course,
  selectedModule,
  selectedLesson,
  setSelectedLesson,
  setSelectedModule,
  currentIndex,
  setCurrentIndex,
  unlocking,
  unlockedVideos,
  totalVideos,
  progress,
  userId,
  hasCompletedQuiz,
  setHasCompletedQuiz,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // const filteredVideos = course.videos.filter((video) =>
  //   video.title.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const handleModalClose = () => {
  //   setShowQuiz(false);
  //   setSubmitted(false);
  // };

  log.info('module: ', selectedModule);

  return (
    <div>
      {/* <div className="mb-4">
        <div className="flex items-center justify-between w-full gap-2 ">
          <div className="w-full h-2 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-full bg-primary transition-all  ease-in-out duration-500"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
          <Text variant="h6">
            {unlockedVideos}/{totalVideos}
          </Text>
        </div>
        <Text variant="h6">Lessons</Text>
      </div>
      <div className="mb-2">
        <Input
          placeholder="Search Lesson"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-200 border-none pr-9 text-sm focus:outline focus:outline-primary focus:bg-white "
          icon={<Search size={18} className="text-gray-500 right-full" />}
        />
      </div>
      <div className=" overflow-y-auto">
        {!filteredVideos.length ? (
          <Text className="text-rose-500 text-sm h-full flex items-center justify-center font-semibold">
            No Lesson Found!
          </Text>
        ) : (
          <div className="space-y-2">
            {filteredVideos.map((video, index) => (
              <Text
                key={video._id}
                onClick={
                  video.isUnlocked
                    ? () => setCurrentIndex(index)
                    : () => {
                        toast.error('You must watch all the previous videos');
                      }
                }
                className={cn(
                  'px-2 py-3 rounded-md text-sm transition-all duration-200 w-full flex items-center gap-2',
                  index === currentIndex
                    ? 'bg-indigo-200 dark:bg-gray-500 hover:bg-indigo-200 hover:bg-opacity-100 dark:hover:bg-gray-500'
                    : 'bg-gray-200 dark:bg-gray-700 ',
                  !video.isUnlocked
                    ? 'cursor-not-allowed text-gray-400'
                    : 'cursor-pointer ',

                  video.isUnlocked &&
                    index !== currentIndex &&
                    'hover:bg-primary hover:bg-opacity-30 dark:hover:bg-gray-600'
                )}
                disabled={video.isUnlocked}
              >
                {unlocking ? (
                  <LoadingCircle />
                ) : video.isUnlocked ? (
                  <Play
                    size={20}
                    className="rounded-full bg-primary text-white p-1"
                  />
                ) : (
                  <LockKeyhole
                    size={20}
                    className="bg-primary p-1 rounded-full text-white bg-opacity-50"
                  />
                )}
                {index + 1}. {video.title}
              </Text>
            ))}

            <Button
              onClick={() => setShowQuiz(true)}
              variant="outline"
              className={cn('w-full')}
              disabled={unlockedVideos < totalVideos}
            >
              Take Quiz
            </Button>

            <div>
              <Modal
                isOpen={showQuiz}
                onClose={handleModalClose}
                className="min-w-80"
              >
                <Quiz
                  courseId={course._id}
                  courseTitle={course.title}
                  hasCompletedQuiz={hasCompletedQuiz}
                  setHasCompletedQuiz={setHasCompletedQuiz}
                  submitted={submitted}
                  setSubmitted={setSubmitted}
                  onClose={handleModalClose}
                  SeeCertificateButton={
                    <SeeCertificateButton
                      userId={userId}
                      courseId={course._id}
                      progress={progress}
                      hasCompletedQuiz={hasCompletedQuiz}
                    />
                  }
                />
              </Modal>
            </div>

            <SeeCertificateButton
              userId={userId}
              courseId={course._id}
              progress={progress}
              hasCompletedQuiz={hasCompletedQuiz}
            />
          </div>
        )}
      </div> */}
      <div className="space-y-2">
        <div className="mb-2">
          <Input
            placeholder="Search Lesson"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-200 dark:bg-gray-900 border-none pr-9 text-sm  "
            icon={<Search size={18} className="text-gray-500 right-full" />}
          />
        </div>
        {course.modules.map((module, moduleIndex) => (
          <div key={module._id} className=" rounded-md dark:border-gray-700">
            <div
              className="bg-gray-200 dark:bg-gray-700 rounded-md  bg-opacity-50 w-full  cursor-pointer font-medium"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedModule(
                  module._id === selectedModule ? '' : module._id
                );
              }}
            >
              <div className="flex justify-between items-center p-3">
                {module.title
                  ? `Module ${moduleIndex + 1} : ${module.title}`
                  : `Module ${moduleIndex + 1}`}
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${selectedModule === module._id ? '-rotate-180' : 'rotate-0'}`}
                />
              </div>
              {module._id === selectedModule && (
                <ul className="">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <li
                      key={lesson._id}
                      className="border-t dark:border-t-gray-600 p-3 flex gap-2 items-center text-sm"
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      {lesson.type === 'video' ? (
                        <Play
                          size={18}
                          className="bg-primary p-1 rounded-full text-white"
                        />
                      ) : lesson.type === 'pdf' ? (
                        <File
                          size={18}
                          className="bg-primary p-1 rounded-full text-white"
                        />
                      ) : lesson.type === 'article' ? (
                        <FileText
                          size={18}
                          className="bg-primary p-1 rounded-full text-white"
                        />
                      ) : null}

                      {lesson.title}
                    </li>
                  ))}
                  {module?.quiz?.length > 0 && (
                    <li
                      onClick={() => setSelectedLesson(module.quiz)}
                      className="border-t dark:border-t-gray-600 p-3 flex gap-2 items-center text-sm"
                    >
                      <Trophy
                        size={18}
                        className="bg-primary p-1 rounded-full text-white"
                      />
                      Quiz
                    </li>
                  )}
                </ul>
              )}

              {/* Quiz */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonsList;
