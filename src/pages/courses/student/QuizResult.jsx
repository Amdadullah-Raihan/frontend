import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Text from '../../../components/texts/Text';

const QuizResults = ({ results, onRetry }) => {
  return (
    <div
      className={`p-5 flex flex-col items-center justify-center dark:text-gray-900  ${
        results.isPassed ? 'bg-green-100 ' : 'bg-red-100  '
      } `}
    >
      <div className="flex items-center mb-4">
        {results.isPassed ? (
          <CheckCircle size={24} className="text-green-500 mr-2" />
        ) : (
          <XCircle size={24} className="text-red-500 mr-2" />
        )}
        <Text className="font-bold text-lg">Quiz Results</Text>
      </div>
      <Text className="text-lg font-semibold mb-2">
        Your score: {results.score.toFixed(2)}%
      </Text>
      <Text className="text-center ">
        {results.isPassed ? (
          <>
            <span className="text-green-600 font-bold">Congratulations!</span>{' '}
            You have passed the quiz.
          </>
        ) : (
          <>
            <span className="text-red-500">
              Unfortunately, you did not pass the quiz.
            </span>{' '}
            <button
              onClick={onRetry}
              className="text-blue-500 underline ml-1 focus:outline-none hover:text-blue-600"
            >
              Please try again.
            </button>
          </>
        )}
      </Text>
    </div>
  );
};

export default QuizResults;
