import { Trash2 } from 'lucide-react';
import React from 'react';

import Button from '../../../components/buttons/Button';
import Tooltip from '../../../components/Tooltip';
import { formatDate } from '../../../utils/formatDate';
import Text from '../../../components/texts/Text';

const CertificateTable = ({ certificates, handleRevoke }) => {
  const tableHeaders = [
    'Course',
    'Student',
    'Issue Date',
    'Expiration Date',
    'Actions',
  ];

  const tdStyle = 'px-4 py-2 text-sm leading-5 text-gray-900 dark:text-white';

  if (!certificates.length) {
    return (
      <Text className="text-sm text-rose-500">No certificates found.</Text>
    );
  }

  return (
    <div className="overflow-hidden overflow-x-auto border dark:border-gray-800 shadow-[0_0_2px_rgba(0,0,0,0.2)] rounded-xl">
      <table className="min-w-full ">
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th
                key={header}
                className="p-4 text-xs font-bold leading-4 tracking-wider text-left text-black uppercase bg-gray-200 dark:bg-gray-700 dark:text-white"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
          {certificates.map((certificate) => (
            <tr key={certificate._id}>
              <td className={tdStyle}>{certificate?.courseId?.title}</td>
              <td className={`${tdStyle} `}>
                <span>{certificate?.userId?.username}</span> <br />
                <span className="text-gray-500 dark:text-gray-400">
                  {certificate?.userId?.email}
                </span>
              </td>
              <td className={tdStyle}>{formatDate(certificate.issueDate)}</td>
              <td className={tdStyle}>
                {certificate.expirationDate
                  ? formatDate(certificate.expirationDate)
                  : 'N/A'}
              </td>
              <td className={`${tdStyle} `}>
                <Tooltip content="Delete Certificate" position="left">
                  <Button
                    variant="danger"
                    onClick={() => handleRevoke(certificate)}
                    disabled={true}
                    className="p-2"
                  >
                    <Trash2 size={18} />
                  </Button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CertificateTable;
