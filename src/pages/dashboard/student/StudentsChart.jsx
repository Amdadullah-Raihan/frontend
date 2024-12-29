import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// Mock data
const mockData = [
  { date: '2024-08-01', students: 50 },
  { date: '2024-08-02', students: 75 },
  { date: '2024-08-03', students: 60 },
  { date: '2024-08-04', students: 90 },
  { date: '2024-08-05', students: 85 },
];

const StudentsChart = () => {
  const [studentsData, setStudentsData] = useState([]);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      // Here you would typically make the API call
      // For now, we use mock data
      setStudentsData(mockData);
    };

    fetchData();
  }, []);

  return (
    <div className="pt-5 bg-white rounded-lg">
      <LineChart height={300} width={600} data={studentsData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="students" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default StudentsChart;
