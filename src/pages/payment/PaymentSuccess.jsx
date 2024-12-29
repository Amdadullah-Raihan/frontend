import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/buttons/Button';

function PaymentSuccess() {
  const navigate = useNavigate();
  const { id } = useParams();
  // Extract courseId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('courseId');
  // console.log(courseId);


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full p-5 bg-white rounded-lg shadow-[0_0_2px_rgba(0,0,0,0.2)] sm:w-1/2 lg:w-1/2 text-center space-y-4">
        <h1 className="text-primary font-semibold text-xl lg:text-2xl">Payment Successfully Done</h1>
        <p>Your Transaction Id: {id}</p>
        <div className="flex justify-center space-y-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/courses/${courseId}`)}
            className={'uppercase text-xs'}
          >
            Go To Course
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess

