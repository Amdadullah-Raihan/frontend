import { Edit, EllipsisVertical, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Button from '../../../components/buttons/Button';
import Tooltip from '../../../components/Tooltip';
import Modal from '../../../components/Modal';
import { cn } from '../../../utils/cn';

const UserCard = ({
  user,
  index,
  lastIndex,
  onDelete,
  onUpdate,
  handleUpdateRole,
  handleUpdateStatus,
}) => {
  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const tableDataStyle = ' whitespace-nowrap text-sm bg-white dark:bg-gray-800';
  const dropDownContainerStyle =
    'absolute top-full w-auto rounded-md shadow-[0_0_5px_gray]  bg-gray-700 dark:bg-gray-900 text-white ring-1 ring-black ring-opacity-5 z-50 ';
  const dropDownButtonStyle = cn(
    'block px-4 py-2 text-sm  hover:bg-primaryDark  w-full text-left '
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(event.target)
      ) {
        setShowDropdown1(false);
      }
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target)
      ) {
        setShowDropdown2(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <tr key={index}>
      <td
        className={`${tableDataStyle} pl-4  ${index === lastIndex && 'rounded-bl-xl'}`}
      >
        {index + 1}
      </td>
      <td className={`${tableDataStyle} capitalize`}>{user?.username}</td>
      <td className={tableDataStyle}>{user?.email}</td>
      <td className={tableDataStyle}>
        <div className="relative" ref={dropdownRef1}>
          <p className={`flex items-center gap-1`}>
            {user?.role}
            <EllipsisVertical
              className="cursor-pointer"
              size={16}
              onClick={() => setShowDropdown1(!showDropdown1)}
            />
          </p>
          {showDropdown1 && (
            <div className={dropDownContainerStyle}>
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <button
                  className={cn(
                    dropDownButtonStyle,
                    user.role === 'admin' && 'hidden'
                  )}
                  onClick={() => {
                    handleUpdateRole(user._id, 'admin');
                    setShowDropdown1(false);
                  }}
                  disabled={user.role === 'admin'}
                >
                  Set as <span className="font-medium "> admin</span>
                </button>
                <button
                  className={cn(
                    dropDownButtonStyle,
                    user.role === 'student' && 'hidden'
                  )}
                  onClick={() => {
                    handleUpdateRole(user._id, 'student');
                    setShowDropdown1(false);
                  }}
                >
                  Set as <span className="font-medium">student</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
      <td className={tableDataStyle}>
        <div className="relative" ref={dropdownRef2}>
          <p className={`flex items-center gap-2 font-medium `}>
            <span
              className={`
                ${user.status.toLowerCase() === 'active' && 'text-green-500'}
                ${user.status.toLowerCase() === 'pending' && 'text-primary'}
                ${user.status.toLowerCase() === 'suspend' && 'text-rose-500'}`}
            >
              {user?.status}{' '}
            </span>
            <EllipsisVertical
              className="cursor-pointer"
              size={16}
              onClick={() => setShowDropdown2(!showDropdown2)}
            />
          </p>
          {showDropdown2 && (
            <div className={dropDownContainerStyle}>
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <button
                  className={cn(
                    dropDownButtonStyle,
                    user.status === 'pending' && 'hidden'
                  )}
                  onClick={() => {
                    handleUpdateStatus(user._id, 'pending');
                    setShowDropdown2(false);
                  }}
                >
                  Set as <span className="font-semibold">Pending</span>
                </button>
                <button
                  className={cn(
                    dropDownButtonStyle,
                    user.status === 'active' && 'hidden'
                  )}
                  onClick={() => {
                    handleUpdateStatus(user._id, 'active');
                    setShowDropdown2(false);
                  }}
                >
                  Set as <span className="font-semibold">Active</span>
                </button>
                <button
                  className={cn(
                    dropDownButtonStyle,
                    user.status === 'suspend' && 'hidden'
                  )}
                  onClick={() => {
                    handleUpdateStatus(user._id, 'suspend');
                    setShowDropdown2(false);
                  }}
                >
                  Set as <span className="font-semibold">Suspend</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
      <td
        className={`flex gap-4 py-2 text-sm whitespace-nowrap  bg-white dark:bg-gray-800 ${index === lastIndex && 'rounded-br-xl  '}`}
      >
        <Tooltip content="Delete User">
          <Button
            className="flex items-center gap-2 p-2 relative z"
            onClick={() => handleOpenDeleteModal(user)}
            variant="danger"
          >
            <Trash2 size={18} />
          </Button>
        </Tooltip>
        <Tooltip content="Edit User" position="left">
          <Button
            className="flex items-center gap-2 p-2 text-white bg-green-600 border-green-600 hover:bg-green-700"
            onClick={() => onUpdate(user, true)}
          >
            <Edit size={18} />
          </Button>
        </Tooltip>
      </td>
    
        <Modal isOpen={showDeleteModal} onClose={handleCloseDeleteModal}>
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold">
              Are you sure you want to delete &quot;
              <span className="text-rose-500">{userToDelete?.username}</span>
              &quot;?
            </h3>
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onDelete(userToDelete?._id);
                  handleCloseDeleteModal();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
  
    </tr>
  );
};

export default UserCard;
