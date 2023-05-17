/* eslint-disable no-console */
const logger = {
  debug: (message) => console.log(`[DEBUG] ${message}`),
  info: (message) => console.log(`[INFO] ${message}`),
  warning: (message) => console.warn(`[WARNING] ${message}`),
  error: (message) => console.error(`[ERROR] ${message}`)
};

module.exports = { logger };
