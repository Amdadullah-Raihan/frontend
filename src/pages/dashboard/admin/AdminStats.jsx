import React from 'react';
import Text from '../../../components/texts/Text';
import StudentsProgress from './StudentsProgress';
import SummaryPieChart from './SummaryPIeChart';
import VisitsChart from './VisitChart';

const stats = [
  {
    label: 'Total Users',
    value: 'totalUsers',
  },
  {
    title: 'Students Overview',
    label: 'Total Students',
    value: 'totalStudents',
  },
  {
    title: 'Courses Overview',
    label: 'Total Courses',
    value: 'totalCourses',
  },
  {
    title: 'Enrolled Courses Overview',
    label: 'Total Course Enrolled',
    value: 'totalEnrolledCourses',
  },
  // Add more stats if needed
];

const StatCard = ({ label, value, isPercentage, subtitle }) => (
  <div className="flex flex-col justify-between gap-10 px-5 py-3 bg-white dark:bg-gray-800 rounded-lg shadow">
    <div className="flex items-center justify-between gap-6">
      <Text variant="h5">{label}</Text>
      <VisitsChart height={60} width={100} className="-mr-1" />
    </div>
    <div className="flex items-center justify-between gap-10">
      <Text variant="h5">
        {isPercentage
          ? `${value?.toFixed(2)}%`
          : value?.toString().padStart(2, '0')}
      </Text>
      <Text className="text-sm text-gray-500 dark:text-gray-400">
        {subtitle}
      </Text>
    </div>
  </div>
);

const AdminStats = ({ adminInfo, subtitles }) => {
  // Prepare data for the pie chart
  const pieChartData = [
    {
      name: 'Total Certificates Issued',
      value: adminInfo.totalCertificates || 0,
    },
    {
      name: 'Course Completion Rate',
      value: adminInfo.courseCompletionRates || 0,
    },
    { name: 'Total Pending Users', value: adminInfo.totalPendingUsers || 0 },
    { name: 'Total Active Users', value: adminInfo.totalActiveUsers || 0 },
    { name: 'New Users This Month', value: adminInfo.newUsersThisMonth || 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col-reverse gap-4 lg:grid lg:grid-cols-2">
        <div className="flex items-center justify-center p-5 bg-white dark:bg-gray-800 rounded-lg shadow">
          <SummaryPieChart data={pieChartData} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {stats.map(({ label, value, isPercentage }, index) => (
            <StatCard
              key={label}
              label={label}
              value={adminInfo[value]}
              isPercentage={isPercentage}
              subtitle={subtitles[index]}
            />
          ))}
        </div>
      </div>

      <div className="p-5 py-0 bg-white dark:bg-gray-800 rounded-lg shadow">
        <StudentsProgress />
      </div>
    </div>
  );
};

export default AdminStats;
