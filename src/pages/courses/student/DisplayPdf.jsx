import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Import the core styles
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css'; // Import the default layout styles
import { useTheme } from '../../../context/ThemeContext';

import './custom-pdf-styles.css';

const DisplayPdf = ({ pdfUrl }) => {
  const { isDarkMode } = useTheme();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="p-4">
      <div className="rounded-lg overflow-hidden">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <div className="h-[60vh]">
            <Viewer
              fileUrl={pdfUrl}
              plugins={[defaultLayoutPluginInstance]}
              theme={isDarkMode ? 'dark' : 'light'}
            />
          </div>
        </Worker>
      </div>
    </div>
  );
};

export default DisplayPdf;
