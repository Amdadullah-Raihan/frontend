import { useRef } from 'react';

const useRenderCount = () => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(`Render count: ${renderCount.current}`);
};
