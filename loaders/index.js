const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const logger = require('../config/logger');
const subscribers = require('../subscribers');
const EventEmitter = require('../utils/EventEmitter');

module.exports = async (app) => {
  await mongooseLoader();
  logger.info('MongoDB loaded and connected!');
  await expressLoader(app);
  logger.info('Express app loaded!');
  // Register subscribers
  Object.keys(subscribers).forEach((eventName) => {
    EventEmitter.on(eventName, subscribers[eventName]);
  });
};
