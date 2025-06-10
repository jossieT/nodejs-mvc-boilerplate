const config = require('./config/config');
const http = require('http');
//const bodyParser = require('body-parser');
const express = require('express');
const logger = require('./config/logger');
const loader = require('./loaders');
const { swaggerDocs } = require('./swagger');

const exitHandler = (server) => {
  if (server) {
    server.close(() => {
      logger.info('Server CLosed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unExpectedErrorHandler = (server) => {
  return function (error) {
    logger.error(error);
    exitHandler(server);
  };
};

const startServer = async () => {
  const app = express();
  await loader(app);
  const httpServer = http.createServer(app);
  const server = httpServer.listen(config.port, () => {
    logger.info(`server listening on Port ${config.port}`);
  });
  swaggerDocs(app, config.port);
  // Move swaggerDocs outside of the server.listen callback
  process.on('uncaughtException', unExpectedErrorHandler(server));
  process.on('unhandledRejection', unExpectedErrorHandler(server));
  process.on('SIGTERM', () => {
    logger.info('SIGTERM Received');
    if (server) {
      server.close();
    }
  });
};

startServer();
