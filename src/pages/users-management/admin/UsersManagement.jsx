import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Button from '../../../components/buttons/Button';
import Modal from '../../../components/Modal';
import Text from '../../../components/texts/Text';
import AddUser from './AddUser';
import UpdateUser from './UpdateUser';
import UserCard from './UserCard';
import SkeletonTable from '../../../components/skeletons/SkeletonTable';
import axiosInstance from '../../../api/axiosInstance';
import useTitle from '../../../hooks/useTitle';
import Pagination from '../../../components/Pagination';

const tabs = ['all', 'pending', 'active', 'suspend'];

const UsersManagement = () => {
  useTitle('Users');
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [status, setStatus] = useState('all');
  const [users, setUsers] = useState([]);
  const [updateData, setUpdateData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const headerStyle =
    'py-4 text-left text-xs font-bold text-black uppercase tracking-wider dark:text-white';

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      toast.success('User Deleted successfully!');
    } catch (error) {
      console.error('Failed to delete user', error);
      toast.error('User Delete Failed!');
    }
  };

  const handleUpdate = (user, open) => {
    setUpdateData(user);
    setIsOpen1(open);
  };

  const handleUpdateRole = async (id, role) => {
    try {
      const response = await axiosInstance.put(`/api/users/role`, {
        userId: id,
        role,
      });
      const updatedUser = response.data.user;
      setUsers(
        users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
      toast.success('User Role Updated successfully!');
    } catch (error) {
      console.error('Failed to update role', error);
      toast.error('Failed to update user role!');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await axiosInstance.put(`/api/users/status`, {
        userId: id,
        status,
      });
      const updatedUser = response.data.user;
      setUsers(
        users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
      toast.success('User Status Updated successfully!');
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Failed to update user Status!');
    }
  };

  const addUserAndUpdateList = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setIsOpen(false);
  };

  const updateUserInList = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
    setIsOpen1(false);
  };

  const fetchUsers = async (page, limit, status) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/api/users', {
        params: { status, page, limit },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalUsers);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, limit]);

  useEffect(() => {
    fetchUsers(currentPage, limit, status);
  }, [currentPage, limit, status]);

  if (isLoading) {
    return <SkeletonTable />;
  }

  return (
    <main className="max-w-screen-xl mx-auto">
      <section className="flex items-center justify-between mb-5 border dark:border-gray-800 bg-white dark:bg-gray-800 rounded-xl p-3">
        <div className="w-full">
          <div className="flex items-center justify-between w-full">
            <Text variant="h4" className="font-bold md:hidden">
              Manage Users
            </Text>
            <Button
              className="flex items-center gap-2 p-2 md:hidden"
              onClick={() => setIsOpen(true)}
              variant="primary"
            >
              <Plus size={18} /> Add User
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Text variant="h4" className="hidden font-bold md:block">
              Manage Users
            </Text>
            <div className="flex">
              {tabs.map((tab, index) => (
                <Button
                  key={index}
                  className={`font-bold capitalize bg-transparent dark:bg-transparent  ${index === activeTab ? 'bg-primary dark:bg-primary  cursor-default hover:bg-primary dark:hover:bg-primary' : 'text-gray-900 dark:text-white dark:hover:text-primary hover:bg-transparent dark:hover:bg-transparent hover:text-primary'}`}
                  onClick={() => {
                    setActiveTab(index);
                    setStatus(tab);
                  }}
                >
                  {tab}
                </Button>
              ))}
            </div>
            <Button
              className="items-center hidden gap-1  md:flex"
              onClick={() => setIsOpen(true)}
              variant="primary"
            >
              <Plus size={18} /> Add User
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full">
        <div className="z-0 w-full h-auto min-w-full overflow-x-auto rounded-xl pb-72">
          <div className="border dark:border-gray-800 shadow rounded-xl">
            {!users.length ? (
              <Text
                variant="h6"
                className="p-4 text-center bg-white dark:bg-gray-800 text-rose-500"
              >
                No user found!
              </Text>
            ) : (
              <table className="w-full divide-y dark:divide-gray-700 rounded-xl">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className={headerStyle}></th>
                    <th className={headerStyle}>User Name</th>
                    <th className={headerStyle}>Email</th>
                    <th className={headerStyle}>Role</th>
                    <th className={headerStyle}>Status</th>
                    <th className={headerStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 rounded-xl">
                  {users.map((user, index) => (
                    <UserCard
                      key={index}
                      index={index}
                      user={user}
                      lastIndex={users.length - 1}
                      onDelete={handleDelete}
                      onUpdate={handleUpdate}
                      handleUpdateRole={handleUpdateRole}
                      handleUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="-mt-72 ">
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
        </div>
      </section>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="w-full md:max-w-xs"
      >
        <AddUser
          updateUsers={addUserAndUpdateList}
          close={() => setIsOpen(false)}
        />
      </Modal>

      <Modal isOpen={isOpen1} onClose={() => setIsOpen1(false)}>
        <UpdateUser
          updateUsersData={updateData}
          updateUsersList={updateUserInList}
          close={() => setIsOpen1(false)}
        />
      </Modal>
    </main>
  );
};

export default UsersManagement;
