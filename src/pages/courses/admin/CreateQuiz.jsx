import React, { useRef, useState } from 'react';
import Input from '../../../components/inputs/Input';
import Button from '../../../components/buttons/Button';
import Text from '../../../components/texts/Text';
import Checkbox from '../../../components/inputs/Checkbox';
import Tooltip from '../../../components/Tooltip';
import { ChevronDown, Plus, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateCourse } from '../../../context/CreateCourseContext';
import axiosInstance from '../../../api/axiosInstance';

const CreateQuiz = () => {
  const { courseData, updateCourseData, goToStep } = useCreateCourse();
  const [selectedModule, setSelectedModule] = useState('');
  const scrollRef = useRef();

  const handleQuestionChange = (
    moduleIndex,
    quizIndex,
    questionIndex,
    value
  ) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].quiz[quizIndex].questions[
      questionIndex
    ].question = value;
    updateCourseData({ ...courseData, modules: updatedModules });
  };

  const handleOptionChange = (
    moduleIndex,
    quizIndex,
    questionIndex,
    optionIndex,
    value
  ) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].quiz[quizIndex].questions[
      questionIndex
    ].options[optionIndex] = value;
    updateCourseData({ ...courseData, modules: updatedModules });
  };

  const handleCorrectAnswerChange = (
    moduleIndex,
    quizIndex,
    questionIndex,
    optionIndex
  ) => {
    const updatedModules = [...courseData.modules];
    const selectedOptionValue =
      updatedModules[moduleIndex].quiz[quizIndex].questions[questionIndex]
        .options[optionIndex];
    updatedModules[moduleIndex].quiz[quizIndex].questions[
      questionIndex
    ].answer = selectedOptionValue;
    updateCourseData({ ...courseData, modules: updatedModules });
  };

  const addQuestion = (moduleIndex, quizIndex) => {
    const updatedModules = [...courseData.modules];
    if (updatedModules[moduleIndex].quiz[quizIndex].questions.length >= 10) {
      toast.error("You can't add more than 10 questions");
      return;
    }
    updatedModules[moduleIndex].quiz[quizIndex].questions.push({
      question: '',
      options: ['', '', '', ''],
      answer: '',
    });
    updateCourseData({ ...courseData, modules: updatedModules });
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const addQuizToModule = (moduleId) => {
    const updatedModules = courseData.modules.map((module) => {
      if (module._id === moduleId) {
        return {
          ...module,
          quiz: [
            {
              questions: [
                {
                  question: '',
                  options: ['', '', '', ''],
                  answer: '',
                },
              ],
            },
          ],
        };
      }
      return module;
    });
    updateCourseData('modules', updatedModules);
  };

  const handleRemoveQuestion = (moduleIndex, quizIndex, questionIndex) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].quiz[quizIndex].questions = updatedModules[
      moduleIndex
    ].quiz[quizIndex].questions.filter((_, i) => i !== questionIndex);
    updateCourseData({ ...courseData, modules: updatedModules });
    toast.error(`Removed question ${questionIndex + 1}`);
  };

  const handleRemoveQuiz = (moduleId) => {
    const updatedModules = courseData.modules.map((module) => {
      if (module._id === moduleId) {
        return { ...module, quiz: null };
      }
      return module;
    });
    updateCourseData({ ...courseData, modules: updatedModules });
    toast.success('Quiz removed successfully!');
  };

  const saveQuiz = async (courseId, moduleId, quizData) => {
    try {
      const response = await axiosInstance.put(
        `/api/courses/add-quiz/${courseId}/modules/${moduleId}`,
        {
          quiz: quizData,
        }
      );

      if (response.status === 200) {
        // Assuming the updated module with the quiz is returned in response.data.module
        const updatedModule = response.data.module;

        // Update the specific module with the updated quiz data
        updateCourseData((prevCourseData) => {
          return {
            ...prevCourseData,
            modules: prevCourseData.modules.map((module) =>
              module._id === moduleId
                ? { ...module, quiz: updatedModule.quiz }
                : module
            ),
          };
        });

        toast.success('Quiz saved successfully!');
      }
    } catch (error) {
      toast.error('Failed to save quiz.');
    }
  };

  if (courseData.modules.length < 1) {
    toast.error('Please add at least one module first!');
    goToStep(4);
    return;
  }

  return (
    <div className="space-y-4">
      {courseData.modules.map((module, moduleIndex) => (
        <div
          key={moduleIndex}
          className="border rounded-lg dark:border-gray-600 overflow-hidden"
        >
          {module.quiz.length ? (
            module.quiz.map((quiz, quizIndex) => {
              return (
                <div key={quizIndex}>
                  <div
                    className={`flex justify-between items-center p-3 ${selectedModule === module._id && 'r border-b dark:border-b-gray-500   '} `}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedModule === module._id) {
                        setSelectedModule('');
                      } else {
                        setSelectedModule(module._id);
                      }
                    }}
                  >
                    <Text variant="h4" className="flex items-center space-x-2">
                      <span>
                        Module {moduleIndex + 1}
                        {module.title ? `: ${module.title}` : ''}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform ease-in-out duration-300 ${selectedModule === module._id ? '-rotate-180 ' : 'rotate-0'}`}
                      />
                    </Text>

                    <Tooltip content="Remove Quiz" position="left">
                      <Button
                        onClick={() => handleRemoveQuiz(module._id)}
                        variant="danger"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </Tooltip>
                  </div>
                  {selectedModule === module._id && quiz.questions.length && (
                    <>
                      {quiz.questions.map((question, questionIndex) => (
                        <div
                          key={questionIndex}
                          ref={scrollRef}
                          className="border-b dark:border-gray-500 p-4 space-y-4"
                        >
                          <div className="w-full flex gap-2 items-center">
                            <div className="w-full">
                              <label htmlFor="">
                                <span className="font-medium">
                                  {`Question ${questionIndex + 1}`}{' '}
                                </span>
                                <span className="opacity-50 font-normal">
                                  / Module {moduleIndex + 1}
                                </span>
                              </label>
                              <Input
                                // label={`Question ${questionIndex + 1}`}
                                placeholder={`Enter Question ${questionIndex + 1}`}
                                value={question.question}
                                className="w-full mt-1"
                                onChange={(e) =>
                                  handleQuestionChange(
                                    moduleIndex,
                                    quizIndex,
                                    questionIndex,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <Tooltip
                              content={`Delete Question ${questionIndex + 1}`}
                            >
                              <Button
                                onClick={() =>
                                  handleRemoveQuestion(
                                    moduleIndex,
                                    quizIndex,
                                    questionIndex
                                  )
                                }
                                variant="danger"
                                className="p-3 mt-3"
                                disabled={quiz.questions.length === 1}
                              >
                                <Trash2 size={18} />
                              </Button>
                            </Tooltip>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="">
                                <div className="flex items-center gap mb-1">
                                  <Tooltip content="Select as Answer">
                                    <Checkbox
                                      checked={
                                        question.answer !== '' &&
                                        question.answer === option
                                      }
                                      disabled={option === ''}
                                      onChange={() =>
                                        handleCorrectAnswerChange(
                                          moduleIndex,
                                          quizIndex,
                                          questionIndex,
                                          optionIndex
                                        )
                                      }
                                    />
                                  </Tooltip>
                                  <Text>{`Option ${optionIndex + 1}`}</Text>
                                </div>
                                <Input
                                  placeholder={`Enter Option ${optionIndex + 1}`}
                                  value={option}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      moduleIndex,
                                      quizIndex,
                                      questionIndex,
                                      optionIndex,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>

                          <Text>
                            {question.answer ? (
                              <>
                                <span className="text-green-500 font-medium">
                                  Answer:
                                </span>{' '}
                                {question.answer}
                              </>
                            ) : (
                              <span className="text-rose-500 font-medium">
                                Please select an option as answer.
                              </span>
                            )}
                          </Text>
                        </div>
                      ))}
                      <div className="p-4">
                        {quiz.questions.length < 10 ? (
                          <div className="flex justify-between">
                            <Button
                              type="button"
                              onClick={() =>
                                addQuestion(moduleIndex, quizIndex)
                              }
                            >
                              <Plus size={18} /> Add Question
                            </Button>
                            <Button
                              variant="success"
                              onClick={() =>
                                saveQuiz(courseData._id, module._id, quiz)
                              }
                            >
                              <Save size={18} />
                              Save Quiz
                            </Button>
                          </div>
                        ) : (
                          <Text className="ml-auto text-right">
                            You added a maximum of 10 questions for this quiz.
                          </Text>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <div
              className="flex justify-between items-center p-3"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedModule(module._id);
              }}
            >
              <Text variant="h4">
                Module {moduleIndex + 1}
                {module.title ? `: ${module.title}` : ''}
              </Text>
              <Button onClick={() => addQuizToModule(module._id)}>
                <Plus size={18} /> Add Quiz
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CreateQuiz;
