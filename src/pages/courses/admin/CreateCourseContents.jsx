import React, { useEffect, useRef, useState } from 'react';
import Button from '../../../components/buttons/Button';
import SelectInput from '../../../components/inputs/SelectInput';
import Tooltip from '../../../components/Tooltip';
import { FilePlus, FileVideo, Plus, Save, Trash2 } from 'lucide-react';
import FileUpload from '../../../components/inputs/FileUpload';
import RichEditor from '../../../components/inputs/RichEditor';
import Input from '../../../components/inputs/Input';
import toast from 'react-hot-toast';
import { useCreateCourse } from '../../../context/CreateCourseContext';
import log from '../../../utils/log';
import axiosInstance from '../../../api/axiosInstance';
import Text from '../../../components/texts/Text';

const CreateCourseContents = () => {
  const { courseData, updateCourseData, goToStep, setCourseData } =
    useCreateCourse();
  const [modules, setModules] = useState(courseData.modules);
  const [addingModule, setAddingModule] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);

  const lessonScrollRef = useRef();
  const moduleScrollRef = useRef();

  const lessonTypes = [
    { value: 'video', label: 'Video' },
    { value: 'pdf', label: 'PDF' },
    { value: 'article', label: 'Article' },
  ];

  const handleAddModule = async () => {
    log.info('courseId: ', courseData._id);
    try {
      setAddingModule(true);
      const savedModule = await axiosInstance.post(
        `/api/courses/create/module`,
        { courseId: courseData._id }
      );
      if (savedModule.status === 200) {
        log.success('new module', savedModule);
        setCourseData(savedModule.data.updatedCourse);
      }
    } catch (err) {
      log.error('Error adding module: ', err);
    } finally {
      setAddingModule(false);
    }

    // Wait a little for the new FAQ to be rendered
    setTimeout(() => {
      if (moduleScrollRef.current) {
        moduleScrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleRemoveModule = async (moduleIndex) => {
    const moduleId = modules[moduleIndex]._id; // Assuming each module has an _id

    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete module ${moduleIndex + 1}?`
      );
      if (!confirmDelete) return;

      // Call the API to delete the module
      await axiosInstance.delete(`/api/courses/delete/module`, {
        data: {
          courseId: courseData._id,
          moduleId,
        },
      });

      // Update the local state after successful deletion
      setModules(modules.filter((_, index) => index !== moduleIndex));
      toast.success(`Module ${moduleIndex + 1} removed successfully`);
    } catch (error) {
      console.error('Failed to delete module:', error);
      toast.error('Failed to remove module. Please try again.');
    }
  };

  const handleAddLesson = async (moduleIndex) => {
    try {
      const lastLesson =
        modules[moduleIndex].lessons[modules[moduleIndex].lessons.length - 1];

      // Validate if the previous lesson has required fields filled
      if (lastLesson && (!lastLesson.title || !lastLesson.content)) {
        toast.error(
          'Please fill in the previous lesson before adding a new one.'
        );
        return;
      }

      setAddingLesson(true);

      const savedLesson = await axiosInstance.post(
        `/api/courses/create/module/lesson`,
        { courseId: courseData._id, moduleId: modules[moduleIndex]._id }
      );

      if (savedLesson.status === 200) {
        log.success('new lesson', savedLesson);
        updateCourseData(
          'modules',
          modules.map((module, index) =>
            index === moduleIndex
              ? {
                  ...module,
                  lessons: [
                    ...module.lessons,
                    savedLesson.data.updateCourse.lessons[0],
                  ],
                }
              : module
          )
        );
      }
    } catch (err) {
      log.error('Error adding a new lesson: ', err);
    } finally {
      setAddingLesson(false);
    }

    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.push({
      type: 'video',
      title: '', // Empty by default
      content: '', // Empty by default
    });
    setModules(updatedModules);

    // Scroll to the newly added lesson
    setTimeout(() => {
      if (lessonScrollRef.current) {
        lessonScrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleUpdateLesson = async (moduleIndex, lessonIndex) => {
    const lessonData = modules[moduleIndex].lessons[lessonIndex];

    if (
      !lessonData.title ||
      !lessonData.type ||
      (!lessonData.content &&
        lessonData.type !== 'video' &&
        lessonData.type !== 'pdf')
    ) {
      toast.error('Please fill in all required fields before updating.');
      return;
    }

    try {
      let formData;

      formData = new FormData();
      formData.append('courseId', courseData._id);
      formData.append('moduleId', modules[moduleIndex]._id);
      formData.append('lessonId', lessonData._id);
      formData.append('title', lessonData.title);
      formData.append('type', lessonData.type);
      formData.append('content', lessonData.content); // File object

      // Debugging formData
      for (let [key, value] of formData.entries()) {
        log.info(`${key}:`, value);
      }
      // Send the request to the backend
      const response = await axiosInstance.put(
        `/api/courses/update/module/lesson`,
        formData
      );

      if (response.status === 200) {
        log.success('Lesson updated successfully', response);

        // Update the state with the updated lesson data
        updateCourseData('modules', response.data.updatedCourse.modules);
        toast.success(
          `Module ${moduleIndex + 1}'s Lesson ${lessonIndex + 1} updated successfully`
        );
      }
    } catch (err) {
      log.error('Error updating the lesson: ', err);
      toast.error('Failed to update the lesson');
    }
  };

  const handleRemoveLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons = updatedModules[
      moduleIndex
    ].lessons.filter((_, index) => index !== lessonIndex);
    setModules(updatedModules);

    toast.error(
      `Removed lesson ${lessonIndex + 1} of module ${moduleIndex + 1}`
    );
  };

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value;
    setModules(updatedModules);
  };

  // useEffect(() => {
  //   updateCourseData('modules', modules);
  // }, [modules]);

  if (!courseData._id) {
    toast.error('Please complete the course info section before proceeding.');
    goToStep(1);
  }

  // log.info('modules', modules);
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {modules.map((module, moduleIndex) => {
          // console.log('modules: ', module);

          return (
            <div
              key={`module-${moduleIndex}`}
              ref={moduleScrollRef}
              className=" border dark:border-gray-500 rounded-lg"
            >
              <div className="flex justify-between items-center  m-4 gap-2">
                <Input
                  value={module.title}
                  onChange={(e) => {
                    const updatedModules = [...modules];
                    updatedModules[moduleIndex].title = e.target.value; // Update the specific module title
                    setModules(updatedModules);
                  }}
                  placeholder={`Module ${moduleIndex + 1}`}
                  className="placeholder:text-gray-900 dark:placeholder:text-white text-2xl font-medium   focus:placeholder:text-gray-400 dark:focus:placeholder:text-gray-600 transition "
                />
                <Tooltip content={`Remove Module ${moduleIndex + 1}`}>
                  <Button
                    variant="danger"
                    className="p-2"
                    onClick={() => handleRemoveModule(moduleIndex)}
                    disabled={moduleIndex === 0 && modules.length === 1}
                  >
                    <Trash2 />
                  </Button>
                </Tooltip>
              </div>

              {module.lessons.map((lesson, lessonIndex) => {
                console.log('modules index  22: ', moduleIndex);
                console.log('lesson index: 22', lessonIndex);

                return (
                  <div
                    key={`lesson-${lessonIndex}`}
                    ref={lessonScrollRef}
                    className="border-b dark:border-gray-500 p-4"
                  >
                    <div className="flex justify-between mb-1">
                      <Text className="font-semibold">
                        {`Lesson ${lessonIndex + 1} title`}
                      </Text>
                      <Text className="text-gray-500">
                        Module {moduleIndex + 1}
                      </Text>
                    </div>
                    <Input
                      name="title"
                      value={lesson.title}
                      className="mb-4"
                      placeholder="Enter the lesson's name"
                      onChange={(e) =>
                        handleLessonChange(
                          moduleIndex,
                          lessonIndex,
                          'title',
                          e.target.value
                        )
                      }
                    />
                    <div className="flex gap-2 items-start mb-2">
                      <SelectInput
                        label={`Lesson ${lessonIndex + 1} Type`}
                        placeholder="Select Lesson Type"
                        value={lesson.type}
                        onChange={(e) =>
                          handleLessonChange(
                            moduleIndex,
                            lessonIndex,
                            'type',
                            e.target.value
                          )
                        }
                        options={lessonTypes}
                        className="flex-1"
                      />
                      <Tooltip content={`Remove Lesson ${lessonIndex + 1}`}>
                        <Button
                          variant="danger"
                          className="p-2 mt-8"
                          onClick={() =>
                            handleRemoveLesson(moduleIndex, lessonIndex)
                          }
                          disabled={
                            lessonIndex === 0 && module.lessons.length === 1
                          }
                        >
                          <Trash2 />
                        </Button>
                      </Tooltip>
                    </div>

                    {lesson.type === 'video' && (
                      <div>
                        <input
                          type="file"
                          name="video"
                          key={`video-${moduleIndex}-${lessonIndex}`}
                          accept="video/*"
                          // icon={FileVideo}
                          // label="Choose a Video"
                          className="file:bg-gray-700 file:text-white file:border-none file:p-2 mt-2 border rounded-lg dark:border-gray-600 w-full mb-4 "
                          // subLabel={`For Lesson ${lessonIndex + 1}`}
                          // value={lesson.content}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              console.log('module index 33: ', moduleIndex);
                              console.log('index index 33: ', lessonIndex);
                              handleLessonChange(
                                moduleIndex,
                                lessonIndex,
                                'content',
                                file
                              );
                            }
                          }}
                        />
                      </div>
                      // <FileUpload
                      //   name="video"
                      //   key={`video-${moduleIndex}-${lessonIndex}`}
                      //   accept="video/*"
                      //   icon={FileVideo}
                      //   label="Choose a Video"
                      //   subLabel={`For Lesson ${lessonIndex + 1}`}
                      //   value={lesson.content}
                      //   handleFileChange={(e) => {
                      //     const file = e.target.files[0];
                      //     if (file) {
                      //       console.log('module index 33: ', moduleIndex);
                      //       console.log('index index 33: ', lessonIndex);
                      //       handleLessonChange(
                      //         moduleIndex,
                      //         lessonIndex,
                      //         'content',
                      //         file
                      //       );
                      //     }
                      //   }}
                      // />
                    )}
                    {lesson.type === 'pdf' && (
                      <FileUpload
                        key={`pdf-${moduleIndex}-${lessonIndex}`}
                        name="pdf"
                        accept="application/pdf"
                        icon={FilePlus}
                        label="Choose a PDF"
                        subLabel={`For Lesson ${lessonIndex + 1}`}
                        value={lesson.content}
                        handleFileChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleLessonChange(
                              moduleIndex,
                              lessonIndex,
                              'content',
                              file
                            );
                          }
                        }}
                      />
                    )}

                    {lesson.type === 'article' && (
                      <RichEditor
                        value={lesson.content}
                        onChange={(content) =>
                          handleLessonChange(
                            moduleIndex,
                            lessonIndex,
                            'content',
                            content
                          )
                        }
                        placeholder={`Write and format the article for lesson ${lessonIndex + 1}...`}
                      />
                    )}
                    <Button
                      variant="success"
                      className={`ml-auto ${lesson.type === 'article' && 'mt-4'}`}
                      onClick={() =>
                        handleUpdateLesson(moduleIndex, lessonIndex)
                      }
                    >
                      <Save size={18} /> Save Lesson {lessonIndex + 1}
                    </Button>
                  </div>
                );
              })}

              <Button
                variant="outline"
                className="gap-1 m-4 ml-auto "
                onClick={() => handleAddLesson(moduleIndex)}
              >
                <Plus size={18} />
                Add Lesson
              </Button>
            </div>
          );
        })}
      </div>

      <Button variant="outline" className="gap-1 " onClick={handleAddModule}>
        <Plus size={18} />
        Add Module
      </Button>
    </div>
  );
};

export default CreateCourseContents;
