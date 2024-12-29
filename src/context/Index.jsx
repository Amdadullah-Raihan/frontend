import { AuthProvider } from './AuthContext';
import { CreateCourseProvider } from './CreateCourseContext';
import { DashboardProvider } from './DashboardContext';
import { ThemeProvider } from './ThemeContext';

export const MainContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DashboardProvider>
          <CreateCourseProvider>{children}</CreateCourseProvider>
        </DashboardProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
