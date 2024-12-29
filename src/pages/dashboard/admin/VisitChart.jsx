import React, { useState, useEffect } from 'react';
import { AreaChart, Area } from 'recharts';

const VisitsChart = ({ ...props }) => {
  // Define mock data
  const mockData = [
    { date: '2024-08-01', visits: 10 },
    { date: '2024-08-02', visits: 20 },
    { date: '2024-08-03', visits: 15 },
    { date: '2024-08-04', visits: 30 },
    { date: '2024-08-05', visits: 25 },
  ];

  const [visitsData, setVisitsData] = useState([]);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      // Here you would typically make the API call
      // For now, we use mock data
      setVisitsData(mockData);
    };

    fetchData();
  }, []);

  return (
    <AreaChart {...props} data={visitsData}>
      <defs>
        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
        </linearGradient>
      </defs>

      <Area
        type="monotone"
        dataKey="visits"
        stroke="#8884d8"
        fill="url(#colorVisits)"
        strokeWidth={3} // Set the stroke width here
      />
    </AreaChart>
  );
};

export default VisitsChart;
