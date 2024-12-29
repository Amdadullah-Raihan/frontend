import React from 'react'
import Button from '../../components/buttons/Button';
import { useNavigate } from 'react-router-dom';

function PaymentError() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full p-5 bg-white rounded-lg shadow-[0_0_2px_rgba(0,0,0,0.2)] sm:w-1/2 lg:w-1/2 text-center space-y-4">
        <h1 className="text-primary font-semibold text-xl lg:text-2xl">Sorry! Your payment failed</h1>
        <p>Please Try again! Sorry for the inconvenience </p>
        <div className="flex justify-center space-y-2">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className={'uppercase text-xs'}
          >
            Go To Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentError

