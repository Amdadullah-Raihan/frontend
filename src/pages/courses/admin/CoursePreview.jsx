import React from 'react';
import { useCreateCourse } from '../../../context/CreateCourseContext';
import log from '../../../utils/log';
import currencySymbols from '../../../utils/currencySymbols';
import Text from '../../../components/texts/Text';
import { FileText, FileType, FileVideo } from 'lucide-react';
import toast from 'react-hot-toast';

const CoursePreview = () => {
  const { courseData, goToStep } = useCreateCourse();

  if (!courseData._id) {
    toast.error('Please complete the course info section before proceeding.');
    goToStep(1);
  }
  return (
    <div className="p-6 space-y-4 border  dark:border-gray-600 shadow-md rounded-lg">
      {/* Course Title */}

      <Text variant="h3" className="mb-2">
        {courseData.title || 'Untitled Course'}
      </Text>

      {/* Course Thumbnail */}
      {courseData.thumbnail || courseData.thumbnailUrl ? (
        <img
          src={
            courseData.thumbnail
              ? URL.createObjectURL(courseData.thumbnail)
              : courseData.thumbnailUrl
          }
          alt="Course Thumbnail"
          className="w-full object-cover rounded-md max-h-72 md:max-h-80"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md">
          <span className="text-gray-500">No Thumbnail</span>
        </div>
      )}

      {/* Course Description */}
      <div>
        <Text variant="h5">Course Description</Text>
        <div
          className="text-gray-600"
          dangerouslySetInnerHTML={{
            __html: courseData.description || 'No description provided.',
          }}
        />
      </div>

      {/* Course Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Text variant="h5">Category</Text>
          <Text className="text-gray-600">
            {courseData.category || 'Not specified'}
          </Text>
        </div>
        <div>
          <Text variant="h5">Level</Text>
          <Text className="text-gray-600">
            {courseData.level || 'Not specified'}
          </Text>
        </div>
        <div>
          <Text variant="h5">Language</Text>
          <Text className="text-gray-600">
            {courseData.language || 'Not specified'}
          </Text>
        </div>
        <div>
          <Text variant="h5">Price</Text>
          <Text className="text-gray-600">
            {courseData.price ? (
              <>
                <span className="font-semibold  ">
                  {currencySymbols[courseData.currency]}
                </span>{' '}
                {courseData.price}
              </>
            ) : (
              'Free'
            )}
          </Text>
        </div>
        <div>
          <Text variant="h5">Discount</Text>
          <Text className="text-gray-600">
            {courseData.discount ? `${courseData.discount}%` : 'No discount'}
          </Text>
        </div>
      </div>

      {/* Course Videos */}
      <div>
        <Text variant="h5">Modules</Text>
        {courseData.modules.length > 0 ? (
          <ul className="space-y-2 mt-2 ml-4">
            {courseData.modules.map((module, moduleIndex) => (
              <React.Fragment key={moduleIndex}>
                <Text>
                  <strong>Module {moduleIndex + 1}: </strong>
                  {module.title || 'Untitled Module'}
                </Text>
                {module.lessons.map((lesson, lessonIndex) => (
                  <li
                    key={moduleIndex + lessonIndex}
                    className=" ml-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-md "
                  >
                    <Text className="flex gap-1 items-center">
                      {lesson.type === 'video' && <FileVideo size={18} />}
                      {lesson.type === 'pdf' && <FileText size={18} />}
                      {lesson.type === 'article' && <FileType size={18} />}
                      <span className="text-sm">
                        {lesson.title ||
                          (lesson.type === 'video'
                            ? 'Untitled Video'
                            : lesson.type === 'pdf'
                              ? 'Untitled Doc'
                              : lesson.type === 'article'
                                ? 'Untitled Article'
                                : 'Untitled')}

                        {!lesson.content &&
                          lesson.type === 'video' &&
                          '(video was not uploaded)'}
                        {!lesson.content &&
                          lesson.type === 'pdf' &&
                          '(PDF was not uploaded)'}
                        {!lesson.content &&
                          lesson.type === 'article' &&
                          '(article was not written)'}
                      </span>
                    </Text>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        ) : (
          <Text className="text-gray-600">No videos added yet.</Text>
        )}
      </div>

      {/* FAQs */}
      <div>
        <Text variant="h5">FAQs</Text>
        {courseData.faqs.length > 0 ? (
          <ul className="space-y-2 mt-2">
            {courseData.faqs.map((faq, index) => (
              <li
                key={index}
                className="p-2 border dark:border-gray-700 rounded-md"
              >
                <Text>
                  <strong>Q{index + 1}: </strong>
                  {faq.question || 'No question'}
                </Text>
                <Text className="text-gray-600">
                  <strong>Answer: </strong>
                  {faq.answer || 'No answer provided'}
                </Text>
              </li>
            ))}
          </ul>
        ) : (
          <Text className="text-gray-600">No FAQs added yet.</Text>
        )}
      </div>

      {/* Tags */}
      <div>
        <Text variant="h5">Tags</Text>
        {courseData.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {courseData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-background dark:bg-gray-700 rounded-md text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <Text className="text-gray-600">No tags added yet.</Text>
        )}
      </div>
    </div>
  );
};

export default CoursePreview;
