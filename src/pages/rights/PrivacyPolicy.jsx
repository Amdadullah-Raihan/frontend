import React, { useEffect, useRef } from 'react';

import Text from '../../components/texts/Text';
import Button from '../../components/buttons/Button';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  const scrollRef = useRef();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (scrollRef.current) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto " ref={scrollRef}>
      <div className="flex justify-between">
        <Text variant="h1" className="text-3xl font-bold mb-4">
          Privacy Policy
        </Text>
        <Button
          variant="light"
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleGoBack}
        >
          <ChevronLeft size={18} />
          <span className="hidden md:block">Go Back</span>
        </Button>
      </div>

      <Text className="mb-4">
        At Octopi Digital LMS, we are committed to protecting your privacy. This
        Privacy Policy outlines how we collect, use, and safeguard your personal
        information.
      </Text>

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          1. Information We Collect
        </Text>
        <Text className="mb-2">
          We collect various types of information to provide and improve our
          services, including:
        </Text>
        <ul className="list-disc pl-10 mb-2">
          <li>
            <Text>
              Personal Information: Name, email address, and other contact
              details.
            </Text>
          </li>
          <li>
            <Text>
              Course Progress: Information related to your course enrollments,
              progress, and completions.
            </Text>
          </li>
          <li>
            <Text>
              Usage Data: Details about how you use the LMS, such as access
              times, pages viewed, and interactions.
            </Text>
          </li>
          <li>
            <Text>
              Payment Information: If you make purchases through the LMS, we may
              collect payment details.
            </Text>
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          2. How We Use Your Information
        </Text>
        <Text className="mb-2">The information we collect is used to:</Text>
        <ul className="list-disc pl-10 mb-2">
          <li>
            <Text>Provide and maintain our LMS services.</Text>
          </li>
          <li>
            <Text>Personalize your learning experience.</Text>
          </li>
          <li>
            <Text>Process transactions and send you related information.</Text>
          </li>
          <li>
            <Text>
              Communicate with you, including responding to your inquiries and
              sending updates.
            </Text>
          </li>
          <li>
            <Text>Improve our platform and develop new features.</Text>
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          3. Data Security
        </Text>
        <Text className="mb-2">
          We implement various security measures to protect your personal
          information. However, no method of transmission over the Internet or
          electronic storage is 100% secure, and we cannot guarantee absolute
          security.
        </Text>
      </section>

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          4. Your Rights
        </Text>
        <Text className="mb-2">
          You have the right to access, correct, or delete your personal
          information held by us. You can also opt-out of receiving
          communications from us at any time.
        </Text>
      </section>

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          5. Changes to This Privacy Policy
        </Text>
        <Text className="mb-2">
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page, and the effective date will be updated.
        </Text>
      </section>

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          6. Contact Us
        </Text>
        <Text className="mb-2">
          If you have any questions about this Privacy Policy, please contact us
          at:{' '}
          <Link
            to="mailto:privacy@octopidigital.com"
            className="hover:underline"
          >
            privacy@octopidigital.com
          </Link>
        </Text>
        <Text className="text-gray-600 mt-6">Last Updated: Sept 4, 2024</Text>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
