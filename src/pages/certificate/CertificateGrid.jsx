import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance'; // Import the customized axios instance
import Text from '../../components/texts/Text';
import { useAuth } from '../../context/AuthContext';

import CertificateTable from './admin/CertificateTable';
import SkeletonCertificates from '../../components/skeletons/SkeletonCertificates';
import SkeletonTable from '../../components/skeletons/SkeletonTable';
import Input from '../../components/inputs/Input';
import { Search } from 'lucide-react';
import useTitle from '../../hooks/useTitle';
import Pagination from '../../components/Pagination';
import CertificateCard from './student/CertificateCard';

const CertificateGrid = () => {
  useTitle('Certificates');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchCertificates = async () => {
      let url;
      if (user.role === 'admin') {
        url = `/api/certificates`; // Use relative URL for admin
      } else {
        url = `/api/certificates/by-email/${user.email}`; // Use relative URL for non-admin
      }
      try {
        setLoading(true);
        const response = await axiosInstance.get(url, {
          params: { page: currentPage, limit },
        }); // Use axiosInstance here
        setCertificates(response.data.certificates);
        setFilteredCertificates(response.data.certificates); // Initialize filtered certificates with all certificates
        setTotalPages(response.data.totalCertificates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user.role, user.email, currentPage, limit]);

  useEffect(() => {
    // Filter certificates based on the search query
    if (searchQuery === '') {
      setFilteredCertificates(certificates); // Show all if search is empty
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = certificates.filter(
        (certificate) =>
          certificate?.courseId?.title.toLowerCase().includes(lowerCaseQuery) ||
          certificate?.userId?.username
            .toLowerCase()
            .includes(lowerCaseQuery) ||
          certificate?.issueDate?.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredCertificates(filtered);
    }
  }, [searchQuery, certificates]);

  const handleCardClick = (certificate) => {
    navigate(`/certificates/${certificate._id}`, {
      state: {
        courseName: certificate.courseId.title,
        issueDate: certificate.issueDate,
        username: certificate.userId.username,
      },
    });
  };

  const handleRevoke = (certificate) => {
    // Handle revoke functionality
  };

  if (loading) {
    return (
      <div>
        {user.role === 'admin' ? <SkeletonTable /> : <SkeletonCertificates />}
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto rounded-xl">
      <div
        className={`mx-auto mb-4 p-3  bg-white grid grid-cols-2 gap-y-4 md:grid-cols-[3fr_2fr] lg:grid-cols-[4fr_1.2fr] items-center rounded-lg shadow sticky top-0 z-[70] dark:bg-gray-800`}
      >
        <Text variant="h4">
          {user.role === 'admin' ? 'Manage Certificates' : 'My Certificates'}
        </Text>
        {user.role === 'admin' && (
          <Input
            placeholder="Search... "
            className="pr-8 text-sm"
            icon={<Search size={18} className="text-gray-500" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />
        )}
      </div>
      {filteredCertificates.length === 0 ? (
        <Text className="text-rose-500">
          {user.role === 'admin'
            ? 'No certificates found.'
            : "You don't have any certificates yet."}
        </Text>
      ) : (
        <>
          {user.role === 'admin' ? (
            <>
              <CertificateTable
                certificates={filteredCertificates}
                handleRevoke={handleRevoke}
              />{' '}
              {totalPages > 0 && (
                <Pagination
                  totalCount={totalPages}
                  pageSize={limit}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  limit={limit}
                  setLimit={setLimit}
                />
              )}
            </>
          ) : (
            <>
              <div
                className={`grid grid-cols-1 gap-4 mx-auto lg:grid-cols-2 xl:grid-cols-3`}
              >
                {filteredCertificates.map((certificate) => (
                  <CertificateCard
                    key={certificate?._id}
                    certificate={certificate}
                    handleCardClick={handleCardClick}
                    isAdmin={user.role === 'admin'}
                  />
                ))}
              </div>
              <Pagination
                totalCount={totalPages}
                pageSize={limit}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                limit={limit}
                setLimit={setLimit}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CertificateGrid;
