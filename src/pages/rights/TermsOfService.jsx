import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Text from '../../components/texts/Text';
import Button from '../../components/buttons/Button';
import { ChevronLeft } from 'lucide-react';

const TermsOfService = () => {
  const scrollRef = useRef();

  const setScrollRef = (node) => {
    if (node) {
      // Node is now attached, do something
      scrollRef.current = node;
      node.scrollTop = 0;
    }
  };

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
    <div className="p-6 max-w-4xl mx-auto" ref={setScrollRef}>
      <div className="flex justify-between">
        <Text variant="h1" className="text-3xl font-bold mb-4">
          Terms of Service
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

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          1. Introduction
        </Text>
        <Text className="mb-2">
          Welcome to Octopi Digital LMS. These Terms of Service govern your use
          of our platform and services. By accessing or using our LMS, you agree
          to be bound by these terms.
        </Text>
      </section>

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          2. User Accounts
        </Text>
        <Text className="mb-2">
          To access certain features of our LMS, you may be required to create
          an account. You are responsible for maintaining the confidentiality of
          your account information and are liable for all activities that occur
          under your account.
        </Text>
      </section>

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          3. Use of the LMS
        </Text>
        <Text className="mb-2">
          You agree to use the LMS in compliance with all applicable laws and
          regulations. You are prohibited from using the LMS to engage in any
          unlawful or harmful activities.
        </Text>
      </section>

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          4. Intellectual Property
        </Text>
        <Text className="mb-2">
          All content on the LMS, including text, graphics, logos, and software,
          is the property of Octopi Digital Ltd. or its licensors and is
          protected by copyright and other intellectual property laws.
        </Text>
      </section>

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          5. Termination
        </Text>
        <Text className="mb-2">
          We reserve the right to terminate or suspend your account if you
          violate these Terms of Service or engage in any conduct that we deem
          harmful to our LMS or other users.
        </Text>
      </section>

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          6. Limitation of Liability
        </Text>
        <Text className="mb-2">
          Octopi Digital Ltd. shall not be liable for any indirect, incidental,
          special, or consequential damages arising out of or in connection with
          your use of the LMS.
        </Text>
      </section>

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          7. Changes to the Terms
        </Text>
        <Text className="mb-2">
          We may update these Terms of Service from time to time. Any changes
          will be posted on this page, and the date of the latest revision will
          be indicated at the top of the page.
        </Text>
      </section>

      <section className="mb-6">
        <Text variant="h2" className="text-2xl font-semibold mb-2">
          8. Contact Us
        </Text>
        <Text className="mb-2">
          If you have any questions about these Terms of Service, please contact
          us at:{' '}
          <Link
            to="mailto:support@octopi-digital.com"
            className="hover:underline"
          >
            support@octopi-digital.com
          </Link>
          .
        </Text>
      </section>

      <Text className="text-gray-600 mt-6">Last Updated: Sept 4, 2024</Text>
    </div>
  );
};

export default TermsOfService;
