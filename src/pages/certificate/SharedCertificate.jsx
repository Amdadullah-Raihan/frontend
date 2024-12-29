import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import logo from '../../assets/logo2.png';
import LoadingCircle from '../../components/svgs/LoadingCircle';
import Text from '../../components/texts/Text';
import { formatDate } from '../../utils/formatDate';
import signature from '../../assets/coo-signature.png';
import axiosInstance from '../../api/axiosInstance';
import useTitle from '../../hooks/useTitle';

const SharedCertificate = () => {
  const { id } = useParams();

  const [certificate, setCertificate] = useState(null);
  useTitle(certificate?.courseId?.title + ' Certificate');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await axiosInstance.get(`/api/certificates/${id}`);
        setCertificate(response.data);
      } catch (error) {
        console.error('Error fetching certificate:', error);
      }
    };

    fetchCertificate();
  }, [id]);

  if (!certificate) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingCircle fill="#ff6700" stroke="#cc5200" className="w-6 h-6" />
      </div>
    );
  }

  if (!certificate) {
    return <div>Certificate Not Found!</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-x-auto">
      <div className="overflow-x-auto bg-white shadow-2xl" id="certificate">
        <div className="h-[510px] w-[877px] bg-white flex ">
          <div className="relative w-1/3 h-full bg-gray-300">
            <div className="flex items-end h-full p-10">
              <img src={logo} alt="Logo" className="w-full" />
              <div className="absolute top-24 -right-1/3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="200"
                  height="200"
                  viewBox="0 0 24 24"
                  fill="gray"
                >
                  <path d="M11.25 9.541l-2.25-2.182.929-.929 1.321 1.253 2.821-2.892.929.93-3.75 3.82zm7.676-3.819c-.482 1.41-.484 1.139 0 2.555.05.147.074.297.074.445 0 .449-.222.883-.615 1.156-1.256.87-1.09.651-1.562 2.067-.198.591-.77.99-1.415.99h-.003c-1.549-.005-1.28-.088-2.528.789-.262.184-.569.276-.877.276s-.615-.092-.876-.275c-1.249-.878-.98-.794-2.528-.789h-.004c-.645 0-1.216-.399-1.413-.99-.473-1.417-.311-1.198-1.562-2.067-.395-.274-.617-.708-.617-1.157 0-.148.024-.298.074-.444.483-1.411.484-1.139 0-2.555-.05-.147-.074-.297-.074-.445 0-.45.222-.883.616-1.157 1.251-.868 1.089-.648 1.562-2.067.197-.591.769-.99 1.413-.99h.004c1.545.005 1.271.095 2.528-.79.262-.183.569-.274.877-.274s.615.091.876.274c1.248.878.98.795 2.528.79h.003c.646 0 1.217.399 1.415.99.473 1.416.307 1.197 1.562 2.067.394.273.616.707.616 1.156 0 .148-.024.299-.074.445zm-2.176 1.278c0-2.623-2.127-4.75-4.75-4.75s-4.75 2.127-4.75 4.75 2.127 4.75 4.75 4.75 4.75-2.128 4.75-4.75zm-7.385 7.931c-.766 0-1.371-.074-1.873-.213-.308 3.068-1.359 5.37-3.492 7.592.854.107 1.95-.094 2.833-.56.317.636.65 1.43.767 2.25 2.009-2.299 3.266-5.054 3.734-8.071-.943-.181-1.234-.496-1.969-.998zm5.27 0c-.737.507-1.043.82-1.968.998.47 3.017 1.726 5.772 3.733 8.071.116-.82.449-1.614.767-2.25.883.465 1.979.667 2.833.56-2.13-2.219-3.168-4.531-3.479-7.595-.503.141-1.112.216-1.886.216z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <div className="py-16 pl-24 ">
              <Text variant="h1">Certificate of Completion</Text>
              <Text className="mt-8 text-gray-400">This is certify that</Text>
              <Text variant="h2" className="uppercase graduate-regular">
                {certificate?.userId?.username}
              </Text>
              <Text className="mt-4 text-gray-400">
                has successfully completed the course{' '}
              </Text>
              <Text variant="h3" className="text-primary">
                {certificate?.courseId?.title}
              </Text>
              <Text className="mt-8 text-gray-400">
                {' '}
                Date of Issue:{' '}
                <span className="font-medium">
                  {' '}
                  {formatDate(certificate?.issueDate)}
                </span>
              </Text>
              <Text className="text-gray-500"> Certificate ID: {id}</Text>
            </div>
            <div className="flex flex-col items-end justify-end w-full text-gray-500 ">
              <div className="relative w-64 pr-4 text-right">
                <img
                  src={signature}
                  alt="Jewel Rana"
                  className="absolute w-full bottom-1/2 -right-14"
                />
                <hr className="relative w-36 -right-24" />
                <Text className="">Jewel Rana</Text>
                <Text className="">COO, Octopi Digital.</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedCertificate;
