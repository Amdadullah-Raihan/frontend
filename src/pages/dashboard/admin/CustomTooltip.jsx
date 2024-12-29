const nameMap = {
  watchTime: 'Watch Time',
  assignmentMarks: 'Assignment Mark',
  // Add more mappings as needed
};

const CustomTooltip = ({ payload, label }) => {
  if (payload.length === 0) return null;

  return (
    <div className="bg-gray-700 dark:bg-gray-900 rounded-md p-3 text-white shadow-2xl space-y-3">
      {label && <p>{label}</p>}
      {payload.map((entry, index) => (
        <p key={index} className=" text-[#8884D8]">
          {nameMap[entry.name] || entry.name}:{' '}
          {typeof entry.value === 'number'
            ? entry.value.toFixed(2)
            : entry.value}
        </p>
      ))}
    </div>
  );
};

export default CustomTooltip;
