import React from 'react';
import Text from '../../components/texts/Text';
import { Link } from 'react-router-dom';

const CopyRight = () => {
  return (
    <footer className="dark:text-white text-center py-4">
      <Text>&copy;2024 Octopi Digital Ltd. All rights reserved.</Text>
      <Text>
        <Link to="/privacy-policy" className="hover:underline text-blue-500">
          Privacy Policy
        </Link>{' '}
        |{' '}
        <Link to="/terms-of-service" className="hover:underline text-blue-500">
          Terms of Service
        </Link>
      </Text>
      <Text>
        Contact Support:{' '}
        <Link
          to="mailto:support@octopi-digital.com"
          className="hover:underline text-blue-500"
        >
          support@octopi-digital.com
        </Link>
      </Text>
      <Text>Built by Octopi Digital Ltd.</Text>
      <Text>Version 1.0.0</Text>
    </footer>
  );
};

export default CopyRight;
