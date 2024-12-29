import { AuthProvider } from './AuthContext';
import { CreateCourseProvider } from './CreateCourseContext';
import { DashboardProvider } from './DashboardContext';

export const MainContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <DashboardProvider>
        <CreateCourseProvider>{children}</CreateCourseProvider>
      </DashboardProvider>
    </AuthProvider>
  );
};
