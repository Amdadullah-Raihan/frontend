import React, { useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { cn } from '../../utils/cn';
import Text from '../texts/Text';

const FileUpload = ({
  handleFileChange,
  accept,
  error,
  icon: Icon,
  label,
  subLabel,
  name,
}) => {
  const [preview, setPreview] = useState(null);

  const handlePreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); // Create a local URL for the file
      setPreview(fileURL);
    }
    // Call the provided file change handler, if any
    if (handleFileChange) {
      handleFileChange(event);
    }
  };

  return (
    <div
      className={cn(
        'mb-4  rounded-md border border-gray-300 border-dashed dark:bg-gray-800 dark:border-gray-500 px-2 py-4',
        error && 'border-red-500 dark:border-red-500' // Apply error class if error exists
      )}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handlePreview} // Use the handlePreview function
        accept={accept}
        name={name}
        // {...restProps}
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center cursor-pointer space-x-2 space-y-3"
      >
        {Icon ? (
          <Icon
            className="h-6 w-6 text-gray-900 dark:text-white "
            size={32}
            strokeWidth={1}
          />
        ) : (
          <CloudUpload
            className="h-6 w-6 text-gray-900 dark:text-white"
            size={32}
            strokeWidth={1}
          />
        )}
        <div className="text-center">
          <p className="text-gray-900 dark:text-white">{label}</p>
          <p className="text-gray-500">{subLabel}</p>
        </div>
      </label>

      {/* Display preview if an image is uploaded */}
      {preview && (
        <div className="mt-4  rounded-md overflow-hidden">
          <img
            src={preview}
            alt="File Preview"
            className="w-full max-h-64 object-contain rounded-md"
          />
        </div>
      )}

      {/* Display error message */}
      {error && (
        <Text className="mt-2 text-red-500 text-sm text-center italic">
          {error}
        </Text>
      )}
    </div>
  );
};

export default FileUpload;
