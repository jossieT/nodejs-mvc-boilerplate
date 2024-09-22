const mongoose = require('mongoose');
const config = require('./config/config');
const http = require('http');
//const bodyParser = require('body-parser');
const app = require('./server');
const logger = require('./config/logger');

const httpServer = http.createServer(app);

mongoose.connect(config.db_connection, {
  useNewUrlParser: true,
}).then(() => {
  logger.info('mongoDB connection successful');
}).catch((error) => {
  logger.error('Error occured with erro message: ', error.message);
});


const server = httpServer.listen(config.port, () => {
  logger.info(`server listening on Port ${config.port}`);
})

const exitHandler = () => {
  if(server) {
    server.close(() => {
      logger.info('Server CLosed');
      process.exit(1);
    })
  } else {
    process.exit(1);
  }
}

const unExpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
}

process.on("uncaughtException", unExpectedErrorHandler);
process.on("unhandledRejection", unExpectedErrorHandler);
process.on("SIGTERM", () => {
  logger.info('SIGTERM Recieved');
  if(server) {
    server.close();
  }
})