import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import CustomTooltip from './CustomTooltip';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6F61'];

const SummaryPieChart = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={150}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend
        wrapperStyle={{
          fontSize: isMobile ? '12px' : '14px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'wrap',
          maxWidth: '100%',
        }}
      />
    </PieChart>
  );
};

export default SummaryPieChart;
