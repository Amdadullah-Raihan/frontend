import React from "react";
import Text from "./texts/Text";

const ComingSoon = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="p-8 text-center bg-white border-2 border-gray-300 rounded-lg shadow-lg">
        <Text
          variant="h1"
          className="mb-4 text-4xl font-bold text-gray-800 animate-pulse"
        >
          Coming Soon...
        </Text>
        <Text className="text-lg text-gray-600">
          We&apos;re working hard to bring you something amazing. Stay tuned!
        </Text>
      </div>
    </div>
  );
};

export default ComingSoon;
