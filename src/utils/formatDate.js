export function formatDate(isoString) {
  const date = new Date(isoString);

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
  };

  return date.toLocaleDateString('en-US', options);
}

// Example usage
// const isoString = '2024-07-14T09:34:49.977Z';
// const formattedDate = formatDate(isoString);
// console.log(formattedDate); // Outputs: "July 14, 2024, 09:34 AM"
