import React, { useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import log from '../../../utils/log';

const UploadPdf = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  // Handle PDF upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFiles) {
      setUploadStatus('Please select a PDF file to upload.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('pdfs', selectedFiles[i]); // 'pdfs' field matches with backend
    }

    try {
      const response = await axiosInstance.post(
        '/api/courses/upload-pdf',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUploadStatus('PDF(s) uploaded successfully!');
      log.success('PDF(s) uploaded successfully!', response.data); // Handle the response data
    } catch (error) {
      setUploadStatus('Error uploading PDF(s)');
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Upload PDF(s)</h2>
      <form>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleUpload}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Upload
        </button>
      </form>
      {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
    </div>
  );
};

export default UploadPdf;
