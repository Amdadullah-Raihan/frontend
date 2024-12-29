import Text from '../../../components/texts/Text';
import Accordion from '../../../components/Accordion';

const ViewDetails = ({ course, actionButton }) => {
  return (
    <div className=" p-2 md:p-3 lg:p-5">
      <div className="p-4 border dark:border-gray-700 rounded-xl">
        <Text variant="h3" className="mb-6">
          {course.title}
        </Text>
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="object-cover w-full mb-8 rounded-lg h-60"
        />
      </div>
      <div className="p-4 my-5 border dark:border-gray-700 rounded-xl">
        <Text variant="h3" className="pb-1 mb-6 border-b dark:border-gray-700">
          Course&apos;s Description
        </Text>
        <Text className="mb-6 text-gray-500">{course.description}</Text>

        <Text variant="h4" className="mb-4">
          Frequently Asked Questions
        </Text>
        {course.faqs &&
          course.faqs.map((faq, index) => (
            <div key={index}>
              <Accordion title={faq.question} content={faq.answer} />
            </div>
          ))}
      </div>
      <div className="flex justify-between gap-2">{actionButton}</div>
    </div>
  );
};

export default ViewDetails;
