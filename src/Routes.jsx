import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import NotFound from './NotFound';
import Account from './pages/account/Account';
import ForgotPassword from './pages/auth/ForgotPassword';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CertificateGrid from './pages/certificate/CertificateGrid';
import CourseDetails from './pages/courses/student/CourseDetailsPage';
import Courses from './pages/courses/student/Courses';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';
import UsersManagement from './pages/users-management/admin/UsersManagement';
import MyCourseList from './pages/courses/student/MyCourseList';
import ManageCourses from './pages/courses/admin/ManageCoursesPage';
import VerifyEmail from './pages/auth/VerifyEmail';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentError from './pages/payment/PaymentError';
import MoreCourses from './pages/courses/student/MoreCourses';
import PrivacyPolicy from './pages/rights/PrivacyPolicy';
import TermsOfService from './pages/rights/TermsOfService';
import CreateCoursePage from './pages/courses/admin/CreateCoursePage';
import SingleCertificate from './pages/certificate/student/SingleCertificate';
import SharedCertificate from './pages/certificate/SharedCertificate';
import { useSelector } from 'react-redux';

const Routers = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Register />}
      />

      <Route path="/" element={user ? <Home /> : <Navigate to="/login" />}>
        <Route path="/" index element={<Dashboard />} />
        <Route path="/courses" element={<Courses />}>
          <Route
            index
            element={
              user?.role === 'student' ? <MyCourseList /> : <ManageCourses />
            }
          />

          <Route path="manage" element={<ManageCourses />} />
          <Route path="my-courses" element={<MyCourseList />} />
          <Route path="more-courses" element={<MoreCourses />} />
        </Route>
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/courses/create" element={<CreateCoursePage />} />
        <Route path="/courses/update" element={<CreateCoursePage />} />
        <Route path="/certificates" element={<CertificateGrid />} />
        <Route path="/certificates/:id" element={<SingleCertificate />} />

        <Route path="/users" element={<UsersManagement />} />
        {/* <Route path="/learning-report" element={<LearningReport />} /> */}
        <Route path="/profile" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/certificates/shared/:id" element={<SharedCertificate />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forget-password" element={<ForgotPassword />} />
      <Route path="/payment-success/:id" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentError />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
    </Routes>
  );
};

export default Routers;
