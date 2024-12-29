const getDimensions = (ref) => {
  if (!ref) return { width: 0, height: 0 };
  return {
    width: ref?.current.offsetWidth,
    height: ref?.current.offsetHeight,
  };
};

export { getDimensions };
