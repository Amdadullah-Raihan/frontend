import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/buttons/Button';
import axiosInstance from '../../../api/axiosInstance';

const SeeCertificateButton = ({
  userId,
  courseId,
  progress,
  hasCompletedQuiz,
}) => {
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch certificate information
  useEffect(() => {
    const checkCertificate = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/certificates/${courseId}/${userId}`
        );
        setCertificate(response.data);
      } catch (error) {
        console.error('Error checking certificate:', error);
      }
    };

    checkCertificate();
  }, [userId, courseId]);

  const handleCertificateRequest = async () => {
    setLoading(true);

    if (certificate) {
      // Navigate to the certificate page
      navigate(`/certificates/${certificate._id}`, {
        replace: true,
        state: {
          courseName: certificate?.courseId?.title,
          issueDate: certificate?.issueDate,
          username: certificate?.userId?.username,
        },
      });
    } else {
      try {
        // If no certificate exists, request it
        if (!certificate) {
          const response = await axiosInstance.post(`/api/certificates`, {
            courseId,
            userId,
          });
          const certificate = response.data;
          // Navigate to the certificate page
          navigate(`/certificates/${certificate._id}`, {
            replace: true,
            state: {
              courseName: certificate?.courseId?.title,
              issueDate: certificate?.issueDate,
              username: certificate?.userId?.username,
            },
          });
        }
      } catch (error) {
        console.error('Error requesting certificate:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-end">
      <Button
        onClick={handleCertificateRequest}
        className="w-full"
        disabled={loading || parseInt(progress) !== 100 || !hasCompletedQuiz}
      >
        {loading ? 'Processing...' : 'See Certificate'}
      </Button>
    </div>
  );
};

export default SeeCertificateButton;
