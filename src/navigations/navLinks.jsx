import {
  BookOpen,
  Compass,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  NotebookPen,
  Plus,
  ShieldCheck,
  UserRoundCog,
  UsersRound,
} from 'lucide-react';

export const navLinks = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard size={18} />,
    roles: ['admin', 'student'],
  },
  {
    label: 'Users',
    href: '/users',
    icon: <UsersRound size={18} />,
    roles: ['admin'],
  },
  {
    label: 'Courses',
    href: '/courses',
    icon: <BookOpen size={18} />,
    roles: ['student', 'admin'],
    subLinks: [
      {
        icon: <GraduationCap size={18} />,
        label: 'My Courses',
        href: '/courses/my-courses',
        roles: ['student'],
      },
      {
        icon: <Compass size={16} className="ml-[0.1rem]" />,
        label: 'More Courses',
        href: '/courses/more-courses',
        roles: ['student'],
      },
      {
        icon: <NotebookPen size={16} className="ml-[0.1rem]" />,
        label: 'Manage Courses',
        href: '/courses/manage',
        roles: ['admin'],
      },
      {
        icon: <Plus size={16} className="ml-[0.1rem]" />,
        label: 'Add Course',
        href: '/courses/create',
        roles: ['admin'],
      },
    ],
  },
  {
    label: 'Certificates',
    href: '/certificates',
    icon: <ShieldCheck size={18} />,
    roles: ['admin', 'student'],
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: <UserRoundCog size={18} />,
    roles: ['admin', 'student'],
  },
  {
    label: 'Logout',
    href: '/logout',
    icon: <LogOut size={18} />,
    roles: ['admin', 'student'],
  },
];
