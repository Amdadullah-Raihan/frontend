import { useState } from 'react';
import { ChevronDown, CircleUserRound } from 'lucide-react';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { navLinks } from './navLinks';
import Button from '../components/buttons/Button';
import Text from '../components/texts/Text';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LogoWhite from '../components/logos/LogoWhite';
import Logo from '../components/logos/Logo';
import NightModeToggle from './NightModeToggle ';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();

  // Dropdown state
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleLogout = () => {
    logout();
  };

  // Toggle dropdown
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Filter nav links based on user role
  const filteredNavLinks = navLinks.filter((link) =>
    link.roles.includes(user.user.role)
  );

  return (
    <div
      className="fixed w-64 h-full py-5 m-5 bg-white border dark:border-none rounded-xl dark:bg-gray-800 dark:text-white"
      style={{ maxHeight: `calc(100vh - 40px)` }}
    >
      <div>
        <div className="px-6">
          <Link to="/">{isDarkMode ? <LogoWhite /> : <Logo />}</Link>
        </div>
        <div className="flex items-center gap-2 px-4 mt-7">
          {user.user.image ? (
            <div className="w-10 h-10 overflow-hidden bg-no-repeat bg-contain rounded-full">
              <img src={user.user.image} alt="" />
            </div>
          ) : (
            <CircleUserRound
              className="text-black dark:text-white"
              size={45}
              strokeWidth={1.2}
            />
          )}
          <div>
            <Text
              variant="h6"
              className="max-w-full overflow-hidden capitalize text-nowrap text-ellipsis"
            >
              {user?.user?.username}
            </Text>
            <Text
              className="text-xs text-gray-500 dark:text-gray-300"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
              }}
            >
              {user?.user?.email}
            </Text>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col p-5 pt-10 space-y-3 overflow-y-auto"
        style={{ height: `calc(100vh - 265px)` }}
      >
        {filteredNavLinks.map((link, index) =>
          link.label.toLowerCase() === 'logout' ? (
            <Button
              key={link.href}
              onClick={handleLogout}
              variant="light"
              className="absolute mr-6 capitalize bottom-5 dark:bg-gray-700 dark:text-white"
              style={{ width: `calc(100% - 40px)` }}
            >
              {link.icon} {link.label}
            </Button>
          ) : link.subLinks ? (
            // Check if sub-links are available for the user's role
            link.subLinks.some((subLink) =>
              subLink.roles.includes(user.user.role)
            ) ? (
              <div key={index}>
                {/* Parent link that triggers dropdown */}
                <div
                  onClick={() => toggleDropdown(index)}
                  className="cursor-pointer py-2 px-2 w-full font-medium flex gap-2 text-sm items-center capitalize text-gray-800 hover:text-primary dark:text-white dark:hover:text-primary"
                >
                  {link.icon}
                  <div className="w-full gap-1 flex items-center">
                    {link.label}
                    <span className="">
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 mt-[0.12rem] ${
                          openDropdown === index ? '-rotate-180' : 'rotate-0'
                        }`}
                      />
                    </span>
                  </div>
                </div>

                {/* Dropdown links */}
                <div
                  className={`pl-10 space-y-1 pt-1 transition-all duration-500 ease-in-out overflow-hidden ${
                    openDropdown === index ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  {link.subLinks
                    .filter((subLink) => subLink.roles.includes(user.user.role))
                    .map((subLink) => (
                      <NavLink
                        key={subLink.href}
                        to={subLink.href}
                        className={({ isActive }) =>
                          `${
                            isActive
                              ? 'bg-primary text-white'
                              : 'text-gray-800 dark:text-white hover:text-primary dark:hover:text-primary transition'
                          } capitalize py-2 px-2 w-full flex gap-2 text-sm items-center  rounded`
                        }
                      >
                        {subLink.icon}
                        {subLink.label}
                      </NavLink>
                    ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={link.href}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? 'bg-primary  text-white'
                      : 'text-gray-800 hover:text-primary dark:text-white dark:hover:text-primary'
                  } capitalize py-2 px-2 w-full font-medium flex gap-2 text-sm items-center transition rounded-lg`
                }
                to={link.href}
              >
                {link.icon} {link.label}
              </NavLink>
            )
          ) : (
            <NavLink
              key={link.href}
              className={({ isActive }) =>
                `${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-800 hover:text-primary dark:text-white dark:hover:text-primary'
                } capitalize py-2 px-2 w-full font-medium flex gap-2 text-sm items-center transition  rounded-lg`
              }
              to={link.href}
            >
              {link.icon} {link.label}
            </NavLink>
          )
        )}
        <NightModeToggle />
      </div>
    </div>
  );
};

export default Sidebar;
