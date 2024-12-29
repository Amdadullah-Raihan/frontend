import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// Mock data for demonstration (you'll replace this with real data from the API)
const mockData = [
  { date: '2024-07-28', count: 10 },
  { date: '2024-07-29', count: 12 },
  { date: '2024-07-30', count: 8 },
  { date: '2024-07-31', count: 15 },
  { date: '2024-08-01', count: 9 },
  { date: '2024-08-02', count: 18 },
  { date: '2024-08-03', count: 14 },
];

const UsersChart = () => {
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
          setUsersData(mockData);
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg ">
      <BarChart width={600} height={300} data={usersData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default UsersChart;
