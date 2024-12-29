import React, { useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/buttons/Button';
import Text from '../../../components/texts/Text';
import useTitle from '../../../hooks/useTitle';

const Courses = React.memo(() => {
  useTitle('Courses');
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to /courses/my-courses if the pathname is /courses
  useEffect(() => {
    if (location.pathname === '/courses' && user.user.role === 'student') {
      navigate('/courses/my-courses');
    }
  }, [location.pathname, navigate]);

  const getNavLinkClass = useCallback(
    (isActive) =>
      `font-medium text-sm ${isActive ? 'bg-primary text-white px-4 py-2 rounded-md' : 'hover:text-primary'}`,
    []
  );

  return (
    <div className="max-w-screen-xl mx-auto space-y-5">
      {user.user.role === 'student' ? (
        <div className="sticky top-0 flex items-center gap-5 p-3 bg-white rounded-lg shadow dark:bg-gray-800">
          <NavLink
            className={({ isActive }) => getNavLinkClass(isActive)}
            to="/courses/my-courses"
          >
            My Courses
          </NavLink>
          <NavLink
            className={({ isActive }) => getNavLinkClass(isActive)}
            to="/courses/more-courses"
          >
            More Courses
          </NavLink>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow dark:bg-gray-800">
          <Text variant="h4">Manage Courses</Text>
          <Link to="/courses/create">
            <Button>
              <Plus size={18} />
              Create Course
            </Button>
          </Link>
        </div>
      )}
      <div>
        <Outlet />
      </div>
    </div>
  );
});

// Set a display name for better debugging
Courses.displayName = 'Courses';

export default Courses;
