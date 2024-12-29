import React from "react";

import Text from "./components/texts/Text";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Text variant="h1" className="">
        404! The page you&apos;re looking for was not found.
      </Text>
    </div>
  );
};

export default NotFound;
