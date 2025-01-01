import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Text from '../../../components/texts/Text';
import { useAuth } from '../../../context/AuthContext';
import { formatDateShort } from '../../../utils/formatDateShort';
import CustomTooltip from '../admin/CustomTooltip';
import axiosInstance from '../../../api/axiosInstance';
import log from '../../../utils/log';
import { useSelector } from 'react-redux';

const last7DaysData = [
  {
    date: formatDateShort('2024-07-31'),
    assignmentMarks: 80,
  },
  {
    date: formatDateShort('2024-08-01'),
    assignmentMarks: 85,
  },
  {
    date: formatDateShort('2024-08-02'),
    assignmentMarks: 78,
  },
  {
    date: formatDateShort('2024-08-03'),
    assignmentMarks: 92,
  },
  {
    date: formatDateShort('2024-08-04'),
    assignmentMarks: 88,
  },
  {
    date: formatDateShort('2024-08-05'),
    assignmentMarks: 94,
  },
  {
    date: formatDateShort('2024-08-06'),
    assignmentMarks: 90,
  },
];

const last30DaysData = [
  {
    date: formatDateShort('2024-07-08'),
    assignmentMarks: 65,
  },
  {
    date: formatDateShort('2024-07-09'),
    assignmentMarks: 70,
  },
  {
    date: formatDateShort('2024-07-10'),
    assignmentMarks: 68,
  },
  {
    date: formatDateShort('2024-07-11'),
    assignmentMarks: 75,
  },
  {
    date: formatDateShort('2024-07-12'),
    assignmentMarks: 80,
  },
  {
    date: formatDateShort('2024-07-13'),
    assignmentMarks: 82,
  },
  {
    date: formatDateShort('2024-07-14'),
    assignmentMarks: 78,
  },
  {
    date: formatDateShort('2024-07-15'),
    assignmentMarks: 85,
  },
  {
    date: formatDateShort('2024-07-16'),
    assignmentMarks: 90,
  },
  {
    date: formatDateShort('2024-07-17'),
    assignmentMarks: 88,
  },
  {
    date: formatDateShort('2024-07-18'),
    assignmentMarks: 86,
  },
  {
    date: formatDateShort('2024-07-19'),
    assignmentMarks: 92,
  },
  {
    date: formatDateShort('2024-07-20'),
    assignmentMarks: 94,
  },
  {
    date: formatDateShort('2024-07-21'),
    assignmentMarks: 89,
  },
  {
    date: formatDateShort('2024-07-22'),
    assignmentMarks: 90,
  },
  {
    date: formatDateShort('2024-07-23'),
    assignmentMarks: 91,
  },
  {
    date: formatDateShort('2024-07-24'),
    assignmentMarks: 93,
  },
  {
    date: formatDateShort('2024-07-25'),
    assignmentMarks: 87,
  },
  {
    date: formatDateShort('2024-07-26'),
    assignmentMarks: 95,
  },
  {
    date: formatDateShort('2024-07-27'),
    assignmentMarks: 88,
  },
  {
    date: formatDateShort('2024-07-28'),
    assignmentMarks: 89,
  },
  {
    date: formatDateShort('2024-07-29'),
    assignmentMarks: 92,
  },
  {
    date: formatDateShort('2024-07-30'),
    assignmentMarks: 91,
  },
  {
    date: formatDateShort('2024-07-31'),
    assignmentMarks: 94,
  },
  {
    date: formatDateShort('2024-08-01'),
    assignmentMarks: 96,
  },
  {
    date: formatDateShort('2024-08-02'),
    assignmentMarks: 93,
  },
  {
    date: formatDateShort('2024-08-03'),
    assignmentMarks: 97,
  },
  {
    date: formatDateShort('2024-08-04'),
    assignmentMarks: 55,
  },
  {
    date: formatDateShort('2024-08-05'),
    assignmentMarks: 98,
  },
  {
    date: formatDateShort('2024-08-06'),
    assignmentMarks: 100,
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const LearningReport = () => {
  const { isDarkMode } = useSelector((state) => state.theme);

  //Local States
  const { user } = useAuth();
  const [data, setData] = useState(last7DaysData);
  const [view, setView] = useState('weekly');
  const [pieData, setPieData] = useState([]);
  const [watchTime, setWatchTime] = useState([]);
  const [quizData, setQuizData] = useState({
    totalQuizzes: 0,
    completeQuizzes: 0,
    incompleteQuizzes: 0,
    avgMark: 0,
  });

  const handleViewChange = (event) => {
    const selectedView = event.target.value;
    setView(selectedView);
    setData(selectedView === 'weekly' ? last7DaysData : last30DaysData);
  };

  useEffect(() => {
    // log.info('watch time', watchTime);
    const calculatePieData = () => {
      const categories = { Low: 0, Medium: 0, High: 0 };
      watchTime.forEach((entry) => {
        if (entry.watchTime <= 0.3) categories.Low += 1;
        else if (entry.watchTime <= 0.8) categories.Medium += 1;
        else categories.High += 1;
      });
      return [
        { name: 'Low', value: categories.Low },
        { name: 'Medium', value: categories.Medium },
        { name: 'High', value: categories.High },
      ];
    };

    setPieData(calculatePieData());
  }, [watchTime]);

  const generateDateRange = (startDate, endDate) => {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dateArray.push(formatDateShort(currentDate.toISOString().split('T')[0])); // Ensure the format matches your API
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  };

  // Fetch quiz stats
  useEffect(() => {
    const { _id: studentId, email } = user.user;
    const fetchQuizStats = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/quiz-progress/stats/${studentId}/${email}`
        );

        log.success('quiz stats: ', JSON.stringify(response.data));
        setQuizData(response.data);
      } catch (error) {
        log.error('Error fetching quiz stats: ', error);
      }
    };
    fetchQuizStats();
  }, []);

  // Fetch data based on view (weekly or monthly)
  useEffect(() => {
    const userId = user.user._id;
    const convertToMinutes = (milliseconds) => {
      return (milliseconds / 60000).toFixed(2); // Convert milliseconds to minutes
    };

    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (view === 'weekly' ? 7 : 30));

        const response = await axiosInstance.get(
          `/api/watchTime/${userId}/${startDate.toISOString().split('T')[0]}/${today}`
        );

        // console.log('response: ', response.data);

        // Generate a complete date range
        const dateRange = generateDateRange(startDate, endDate);

        // Create a dictionary for quick lookup
        const dataDict = response.data.reduce((acc, cur) => {
          // Convert ISO date to "YYYY-MM-DD"
          const dateKey = formatDateShort(
            new Date(cur.date).toISOString().split('T')[0]
          );

          acc[dateKey] = cur;
          return acc;
        }, {});

        // Fill in missing dates with zero values
        const filledData = dateRange.map((date) => ({
          date,
          watchTime: dataDict[date]
            ? convertToMinutes(dataDict[date].watchTime)
            : 0,
        }));

        // console.log('filled data: ', filledData);

        setWatchTime(filledData);
      } catch (error) {
        console.error('Error fetching watch time data:', error);
      }
    };

    fetchData();
  }, [view]);

  const formatWatchTime = (minutes) => {
    // Calculate hours and remaining minutes
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    // Create a formatted string
    let formattedTime = '';
    if (hours > 0) {
      formattedTime += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (remainingMinutes > 0 || hours === 0) {
      if (hours > 0) {
        formattedTime += ' ';
      }
      formattedTime += `${remainingMinutes.toFixed(2)} minute${remainingMinutes.toFixed(2) > 1 ? 's' : ''}`;
    }

    return formattedTime || '0 minutes'; // Handle the case where no time is provided
  };
  const totalWatchTimeMinutes = watchTime.reduce(
    (total, entry) => total + parseFloat(entry.watchTime),
    0
  );

  // console.log('totalWatchTimeMinutes: ' + totalWatchTimeMinutes);
  const formattedWatchTime = formatWatchTime(totalWatchTimeMinutes);

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between">
        <Text variant="h4">Learning Report</Text>
        <div>
          <label>
            <select
              value={view}
              onChange={handleViewChange}
              className="px-2 py-1 text-white rounded-md shadow bg-[#8884D8] dark:bg-gray-800 dark:hover:bg-gray-700 focus:outline-purple-300 text-xs cursor-pointer transition"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
        </div>
      </div>
      <div className="mt-5 space-y-5">
        <div className="flex flex-col w-full gap-5 lg:flex-row">
          <div className="flex items-center justify-center w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow md:p-4 lg:p-5 lg:w-[40%] ">
            <div className="w-full">
              <Text variant="h5" className="mb-4 text-start">
                Watch Time Distribution
              </Text>
              <ResponsiveContainer
                width="100%"
                height={300}
                margin={{ top: -20 }}
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow md:p-4 lg:p-5 w-full lg:w-[60%]">
            <div className="flex items-center justify-between mb-5 ">
              <Text variant="h5">Watch Time (Minutes)</Text>
              <Text className="inline-block px-2 py-1 text-xs font-bold bg-opacity-25 rounded-md bg-primary text-primary">
                Total: {formattedWatchTime}
              </Text>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={watchTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span style={{ fontSize: 14 }}>
                      {value === 'watchTime' ? 'Watch Time' : value}
                    </span>
                  )}
                />
                <Bar dataKey="watchTime" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex flex-col w-full gap-5 lg:flex-row">
          <div className=" w-full lg:w-[60%] p-3 bg-white dark:bg-gray-800 rounded-lg shadow md:p-4 lg:p-5">
            <Text variant="h5" className="mb-4">
              Assignment Mark
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />

                <defs>
                  <linearGradient
                    id="assignmentMark"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <Area
                  // type="monotone"
                  dataKey="assignmentMarks"
                  stroke="#82ca9d"
                  fill="url(#assignmentMark)"
                  strokeWidth={1}
                  dot={{
                    stroke: '#8884d8',
                    strokeWidth: 1,
                    r: 3,
                    fill: '#ffffff',
                  }}
                />
                <Tooltip content={<CustomTooltip />} />

                <Legend
                  formatter={(value) => (
                    <span style={{ fontSize: 14 }}>
                      {value === 'assignmentMarks' ? 'Assignment Mark' : value}
                    </span>
                  )}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className=" w-full lg:w-[50%] p-3 bg-white dark:bg-gray-800 rounded-lg shadow md:p-4 lg:p-5">
            <Text variant="h5">Quiz Mark</Text>
            <div className="flex h-full -mt-5 ">
              <div className="items-center justify-center w-full gap-4 md:flex">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart className="flex items-center justify-center w-full">
                    <Pie
                      data={[
                        {
                          name: 'Complete Quiz',
                          value: quizData.completeQuizzes,
                        },
                        {
                          name: 'Incomplete Quiz',
                          value: quizData.incompleteQuizzes,
                        },
                      ]}
                      cx={100}
                      cy={100}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell key="Complete Quiz" fill="#8884d8" />
                      <Cell key="Incomplete Quiz" fill="#FF8042" />
                      <Label
                        value={`${quizData.avgMark.toFixed(2)}%`}
                        position="center"
                        className="text-xl font-bold"
                        fill={isDarkMode ? 'white' : '#00000'} // Change the text color here
                      />
                    </Pie>

                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-full sm:w-96">
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center gap-2 ">
                      <div
                        className="w-2 h-2 mr-2 rounded-full"
                        style={{ backgroundColor: '#8884d8' }}
                      ></div>
                      <Text variant="h6">Completed Quiz</Text>
                      <Text variant="h6" className="ml-auto">
                        {quizData.completeQuizzes.toString().padStart(2, '0')}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2 ">
                      <div
                        className="w-2 h-2 mr-2 rounded-full"
                        style={{ backgroundColor: '#FF8042' }}
                      ></div>
                      <Text variant="h6">Incomplete Quiz</Text>
                      <Text variant="h6" className="ml-auto">
                        {quizData.incompleteQuizzes.toString().padStart(2, '0')}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2 ">
                      <div
                        className="w-2 h-2 mr-2 rounded-full"
                        style={{ backgroundColor: '#00C49F' }}
                      ></div>
                      <Text variant="h6">Total Quiz</Text>
                      <Text variant="h6" className="ml-auto">
                        {quizData.totalQuizzes.toString().padStart(2, '0')}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningReport;
