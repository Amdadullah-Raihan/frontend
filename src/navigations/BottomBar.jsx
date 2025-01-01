import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { navLinks } from './navLinks';
import { CircleUser, LogOut, UserRoundCog } from 'lucide-react';
import NightModeToggle from './NightModeToggle ';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../store/auth/auth.slice';

const BottomBar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Local States
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    dispatch(removeUser());
  };

  // Filter nav links based on user role and limit to 4 items
  const filteredNavLinks = navLinks
    .filter((link) => link.roles.includes(user.role))
    .slice(0, 4);

  // Handle click outside to close the profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full max-w-md">
      <div className="flex justify-between w-full ">
        {filteredNavLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.href}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-gray-500 dark:text-gray-300 ${isActive ? 'text-primary dark:text-primary' : ''}`
            }
          >
            {link.icon}
            <span
              className="text-xs"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
              }}
            >
              {link.label}
            </span>
          </NavLink>
        ))}

        {/* Profile Menu */}
        <div
          className="relative flex flex-col items-center"
          ref={profileMenuRef}
        >
          <div
            className="flex flex-col items-center"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            {user.image ? (
              <div className="flex items-center justify-center w-[1.2rem] h-[1.2rem] overflow-hidden rounded-full">
                <img src={user.image} alt="" />
              </div>
            ) : (
              <CircleUser
                className="text-gray-500 dark:text-gray-300"
                size={18}
              />
            )}

            <small className="text-xs text-gray-500 dark:text-gray-300">
              Account
            </small>
          </div>
          {isProfileMenuOpen && (
            <div className="absolute pt-2 bg-white border rounded-lg shadow-lg w-44 dark:border-gray-700 dark:bg-gray-800 right-4 bottom-10">
              {user.role === 'admin' && (
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <UserRoundCog size={18} /> Profile
                </Link>
              )}
              <NightModeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center w-full gap-2 px-4 py-2 text-left hover:bg-gray-100"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
