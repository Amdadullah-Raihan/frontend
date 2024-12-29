import { Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Button from '../../../components/buttons/Button';
import Modal from '../../../components/Modal';
import LoadingCircle from '../../../components/svgs/LoadingCircle';
import Text from '../../../components/texts/Text';
import Tooltip from '../../../components/Tooltip';
import UpdateCourse from './UpdateCourse';
import axiosInstance from '../../../api/axiosInstance';
import Pagination from '../../../components/Pagination'; // Import your Pagination component
import { useNavigate } from 'react-router-dom';
import { useCreateCourse } from '../../../context/CreateCourseContext';

const ManageCourses = () => {
  const { setCourseData } = useCreateCourse();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  const openModal = (courseId) => {
    setCourseToDelete(courseId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCourseToDelete(null);
    setEditingCourse(null);
  };

  const handleDeleteCourse = async () => {
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(
        `/api/courses/${courseToDelete}`
      );
      setCourses(courses.filter((course) => course._id !== courseToDelete));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.message);
      console.error('Error deleting course:', error);
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  const handleEditCourse = (course) => {
    localStorage.setItem('savedCourse', course._id);
    setCourseData(course);
    navigate('/courses/update');
  };

  const handleUpdateSuccess = (updatedCourse) => {
    setCourses(
      courses.map((course) =>
        course._id === updatedCourse._id ? updatedCourse : course
      )
    );
    setEditingCourse(null);
  };

  // Fetch courses on page load and when currentPage changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get(`/api/courses`, {
          params: {
            page: currentPage,
            limit: limit,
          },
        });
        setCourses(response.data.courses);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, limit]); // Refetch data when currentPage changes
  if (loading) {
    return (
      <div>
        <LoadingCircle fill="#ff6700" stroke="#cc5200" className="w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="rounded-xl">
      {editingCourse && (
        <UpdateCourse
          id={editingCourse._id}
          editingCourse={editingCourse}
          setEditingCourse={setEditingCourse}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
      <div className="overflow-hidden overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="text-xs uppercase bg-gray-200 dark:bg-gray-700 rounded-t-lg">
              <th className="py-4 text-start"></th>
              <th className="px-4 py-4 text-start">Course Name</th>
              <th className="px-6 py-4 text-start">Description</th>
              <th className="px-6 py-4 text-start">Status</th>
              <th className="pr-4 text-start">Actions</th>
            </tr>
          </thead>
          <tbody className="space-y-6">
            {courses.map((course) => (
              <tr key={course._id} className="divide-y dark:divide-gray-700">
                <td className="px-4 py-2">
                  <div
                    className="flex items-center justify-center w-12 h-12 overflow-hidden border rounded-full bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${course.thumbnailUrl})` }}
                  />
                </td>
                <td className="px-4">
                  <div className="flex flex-col">
                    <span className="text-sm line-clamp-2">{course.title}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {course.modules.length} modules
                    </span>
                  </div>
                </td>
                <td className="pl-6 py-3 overflow-hidden text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-700 dark:text-gray-300 line-clamp-2">
                      {course.description}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {course.faqs.length} FAQs
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 overflow-hidden text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-700 dark:text-gray-300 line-clamp-2">
                      {/* {course.description} */}

                      {course.status === 'published' ? (
                        <span className=" flex items-center gap-1">
                          <Eye size={16} /> Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <EyeOff size={16} /> Unpublished
                        </span>
                      )}
                    </span>
                    {/* <span className="text-xs text-gray-500 dark:text-gray-400">
                      {course.faqs.length} FAQs
                    </span> */}
                  </div>
                </td>
                <td className="pr-5">
                  <div className="flex gap-4">
                    <Tooltip content="Delete Course" position="left">
                      <Button
                        variant="danger"
                        onClick={() => openModal(course._id)}
                        className="p-2"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Edit Course" position="left">
                      <Button
                        variant="success"
                        className="p-2"
                        onClick={() => handleEditCourse(course)}
                        disabled={isDeleting}
                      >
                        <Edit size={18} />
                      </Button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        totalCount={totalPages * limit} // Total number of courses
        pageSize={limit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        setLimit={setLimit}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="p-4 text-center">
          <Text variant="h3">Are you sure you want to delete this course?</Text>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant="secondary"
              onClick={closeModal}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCourse}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageCourses;
