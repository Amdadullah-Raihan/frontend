import Text from '../../../components/texts/Text';
import Accordion from '../../../components/Accordion'; // Importing the reusable Accordion

const CourseDescription = ({ course }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border dark:border-gray-800 rounded-xl">
      <Text variant="h4" className="pb-1 mb-6 border-b dark:border-b-gray-500">
        Course&apos;s Description
      </Text>

      <div
        className="mb-6 text-gray-500 dark:text-gray-400"
        dangerouslySetInnerHTML={{ __html: course.description }}
      />
      <Text variant="h5" className="mb-4">
        Frequently Asked Questions
      </Text>

      {course.faqs &&
        course.faqs.map((faq, index) => (
          <Accordion key={index} title={faq.question} content={faq.answer} />
        ))}
    </div>
  );
};

export default CourseDescription;
