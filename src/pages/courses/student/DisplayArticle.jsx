import React from 'react';

const DisplayArticle = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export default DisplayArticle;
