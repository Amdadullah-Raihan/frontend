import React, { useState, useEffect, useRef } from 'react';
import Text from '../../../components/texts/Text';
import RadioInput from '../../../components/inputs/RadioInput';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../components/buttons/Button';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance';
import log from '../../../utils/log';
import { useAuth } from '../../../context/AuthContext';
import LoadingCircle from '../../../components/svgs/LoadingCircle';
import QuizResults from './QuizResult';

const QUESTIONS_PER_PAGE = 5;

const Quiz = ({
  quiz,
  courseId,
  courseTitle,
  submitted,
  hasCompletedQuiz,
  setSubmitted,
  onClose,
  setHasCompletedQuiz,
  SeeCertificateButton,
}) => {
  const scrollRef = useRef();
  const { user } = useAuth();
  const [questions, setQuestions] = useState(quiz[0].questions);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [quizId, setQuizId] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);
  const [error, setError] = useState('');
  log.info('questions', quiz[0].questions);

  const handleAnswerChange = (questionId, value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const paginatedQuestions = questions.slice(startIndex, endIndex);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  const handleNext = () => {
    const unanswered = paginatedQuestions
      .filter((question) => !selectedAnswers[question._id])
      .map((question) => question._id);

    if (unanswered.length > 0) {
      setUnansweredQuestions(unanswered);
      toast.error('Please answer all questions before proceeding.');
      return;
    }

    setUnansweredQuestions([]);
    setCurrentPage((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const unanswered = paginatedQuestions
      .filter((question) => !selectedAnswers[question._id])
      .map((question) => question._id);

    if (unanswered.length > 0) {
      setUnansweredQuestions(unanswered);
      toast.error('Please answer all questions before proceeding.');
      return;
    }
    const score = calculateScore(selectedAnswers, questions);
    const isPassed = score >= 50;
    setResults({ score, isPassed });
    setSubmitted(true);
    setHasCompletedQuiz(isPassed);
  };

  const calculateScore = (answers, questions) => {
    const correctAnswers = questions.reduce((acc, question) => {
      acc[question._id] = question.answer;
      return acc;
    }, {});
    const totalQuestions = questions.length;
    let correctCount = 0;

    for (const [questionId, userAnswer] of Object.entries(answers)) {
      if (userAnswer === correctAnswers[questionId]) {
        correctCount++;
      }
    }

    return (correctCount / totalQuestions) * 100; // Score in percentage
  };

  //
  const handleRetry = () => {
    setSubmitted(false);
    setResults(null);
    setCurrentPage(1);
  };

  // // Fetch questions from API
  // useEffect(() => {
  //   setLoading(true);
  //   const fetchQuestions = async () => {
  //     try {
  //       const response = await axiosInstance.get(
  //         `/api/quizzes/course/${courseId}`
  //       );
  //       setQuizId(response.data[0]._id);

  //       setQuestions(response.data[0].questions);
  //       setLoading(false);
  //     } catch (err) {
  //       setError('Failed to fetch questions');
  //       setLoading(false);
  //     }
  //   };

  //   fetchQuestions();
  // }, [courseId]); // Re-fetch questions if courseId changes

  // Load quiz progress from the backend or local storage
  useEffect(() => {
    setLoading(true);
    const fetchQuizProgress = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/quiz-progress/result/${user.user._id}/${courseId}`
        );
        if (response.data) {
          setSelectedAnswers(response.data.progress);
          setHasCompletedQuiz(
            response.data.completed && response.data.score >= 50
          );
          setResults((prev) => ({
            ...prev,
            score: response.data.score,
            isPassed: response.data.score >= 50,
          }));
        }
      } catch (err) {
        log.error('Error fetching quiz progress.');
        const savedProgress = JSON.parse(localStorage.getItem('quizProgress'));
        if (savedProgress) {
          setSelectedAnswers(savedProgress);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuizProgress();
  }, [courseId]);

  // Save quiz progress to backend and local storage
  useEffect(() => {
    setSavingProgress(true);
    const saveQuizProgress = async () => {
      localStorage.setItem('quizProgress', JSON.stringify(selectedAnswers));
      try {
        await axiosInstance.post(`/api/quiz-progress/save`, {
          studentId: user.user._id,
          courseId,
          quizId: quizId,
          progress: selectedAnswers,
          score: calculateScore(selectedAnswers, questions), // Add score calculation
          completed: Object.keys(selectedAnswers).length === questions.length,
        });
        log.success('Progress saved successfully.');
      } catch (err) {
        log.error('Failed to save quiz progress.');
      } finally {
        setSavingProgress(false);
      }
    };

    saveQuizProgress();
  }, [selectedAnswers, courseId]);

  // Scroll to top when the page changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  if (loading)
    return (
      <div className="p-2 w-full  h-full">
        <LoadingCircle />
      </div>
    );
  if (error) return <Text className="text-red-500">{error}</Text>;

  if (hasCompletedQuiz && !submitted) {
    return (
      <div>
        <Text className="p-2 bg-green-100 text-center text-rose-500 font-medium">
          You&apos;ve already taken the quiz.{' '}
        </Text>
        <QuizResults results={results} onRetry={handleRetry} />
        {results.isPassed && (
          <div className="p-5 bg-green-100 grid grid-cols-2 gap-2">
            {SeeCertificateButton}
            <Button variant="secondary" onClick={onClose} className="w-full">
              Continue Course
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="">
      {!submitted && (
        <Text className="text-xl px-5 py-3 ">
          <span className="font-bold">Quiz:</span> {courseTitle}
        </Text>
      )}
      {!submitted ? (
        <>
          <div
            className="space-y-2 max-h-[60vh] overflow-y-auto p-5 pt-3 pr-0 "
            ref={scrollRef}
          >
            {paginatedQuestions.map((question, questionIndex) => (
              <div
                key={question._id}
                className="border p-3 rounded-lg dark:border-gray-600"
              >
                <Text
                  className={`font-medium ${
                    unansweredQuestions.includes(question._id)
                      ? 'text-red-500'
                      : ''
                  }`}
                >
                  {questionIndex + 1}. {question.question}
                </Text>
                {question.options.map((option) => (
                  <div key={option} className="space-x-2 mt-2">
                    <RadioInput
                      type="radio"
                      id={`${question._id}-${option}`}
                      name={question._id}
                      value={option}
                      label={option}
                      checked={selectedAnswers[question._id] === option}
                      onChange={() => handleAnswerChange(question._id, option)}
                    />
                  </div>
                ))}
                {unansweredQuestions.includes(question._id) && (
                  <Text className="text-sm text-red-500">
                    Please select an answer to continue.
                  </Text>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 p-5 pt-4">
            <Button
              variant="light"
              className="gap-1"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft size={18} /> Previous
            </Button>

            {currentPage < totalPages ? (
              <>
                {!savingProgress ? (
                  <Button
                    variant="light"
                    className="gap-1"
                    onClick={handleNext}
                  >
                    Next <ChevronRight size={18} />
                  </Button>
                ) : (
                  <Button variant="light" disabled>
                    <span className="space-x-4">
                      Saving Progress{' '}
                      <LoadingCircle className="w-3 h-3 inline-block" />
                    </span>
                  </Button>
                )}
              </>
            ) : (
              <>
                {!savingProgress ? (
                  <Button onClick={handleSubmit}>Submit</Button>
                ) : (
                  <Button variant="light" disabled>
                    <span className="space-x-4">
                      Saving Progress{' '}
                      <LoadingCircle className="w-3 h-3 inline-block" />
                    </span>
                  </Button>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <div>
          <QuizResults results={results} onRetry={handleRetry} />
          {results.isPassed && (
            <div className="p-5 bg-green-100 grid grid-cols-2 gap-2">
              {SeeCertificateButton}
              <Button variant="secondary" onClick={onClose} className="w-full">
                Continue Course
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
