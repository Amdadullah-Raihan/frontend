const log = (() => {
  const isDev = process.env.NODE_ENV === 'development';

  const baseLog = (message, content = '', style = '') => {
    if (isDev) {
      if (content) {
        console.log(`%c${message}`, style, content);
      } else {
        console.log(`%c${message}`, style);
      }
    }
  };

  const success = (message, content = '') => {
    baseLog(message, content, 'color: #4ade80; font-weight: bold;');
  };

  const error = (message, content = '') => {
    baseLog(message, content, 'color: red; font-weight: bold;');
  };

  const info = (message, content = '') => {
    baseLog(message, content, 'color: #06b6d4; font-weight: bold;');
  };

  const warn = (message, content = '') => {
    baseLog(message, content, 'color: orange; font-weight: bold;');
  };

  // The main log function
  const log = (message, content = '') => {
    baseLog(message, content);
  };

  // Attach the specialized log types
  log.success = success;
  log.error = error;
  log.info = info;
  log.warn = warn;

  return log;
})();

export default log;
