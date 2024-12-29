import React from 'react';

import Text from '../../components/texts/Text';
import { useAuth } from '../../context/AuthContext';
import UserStats from './student/UserStats';
import AdminStats from './admin/AdminStats';
import { useDashboard } from '../../context/DashboardContext';
import SkeletonDashboard from '../../components/skeletons/SkeletonDashboard';
import useTitle from '../../hooks/useTitle';

const Dashboard = () => {
  useTitle('Dashboard');
  const { user, loading: userLoading } = useAuth();
  const { loading, adminStats, userStats, subtitles } = useDashboard();

  // Check if loading is complete
  if (loading || userLoading || !adminStats || !userStats || !subtitles) {
    return <SkeletonDashboard />;
  }

  return (
    <div className="max-w-screen-xl mx-auto space-y-4">
      <Text variant="h4">Dashboard</Text>
      {user?.user?.role === 'admin' ? (
        <AdminStats adminInfo={adminStats} subtitles={subtitles} />
      ) : (
        <UserStats userInfo={userStats} user={user} />
      )}
    </div>
  );
};

export default Dashboard;
